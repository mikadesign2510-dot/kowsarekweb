import { storage } from './storage';

export const initErrorLogger = () => {
  if (typeof window === 'undefined') return;

  const handleChunkLoadFailure = () => {
    try {
      const lastReload = parseInt(sessionStorage.getItem('kowsar_chunk_reload') || '0', 10);
      if (Date.now() - lastReload > 8000) {
        sessionStorage.setItem('kowsar_chunk_reload', Date.now().toString());
        console.warn('Deployment chunk hash change detected. Reloading page to fetch latest bundle...');
        window.location.reload();
      }
    } catch {}
  };

  // Listen for Vite preload error
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    handleChunkLoadFailure();
  });

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event.reason?.message || '';
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('dynamically imported module') ||
      msg.includes('error loading dynamically imported module') ||
      event.reason?.name === 'ChunkLoadError'
    ) {
      handleChunkLoadFailure();
      return;
    }

    storage.addLog({
      level: 'error',
      source: 'Unhandled Promise Rejection',
      message: event.reason?.message || 'خطای ناشناخته در Promise',
      details: event.reason?.stack || JSON.stringify(event.reason)
    });
  });

  // Capture global window errors
  window.addEventListener('error', (event) => {
    // Ignore ResizeObserver loop limit exceeded error which is benign in most cases
    if (event.message === 'ResizeObserver loop limit exceeded') return;

    if (
      event.message?.includes('Failed to fetch dynamically imported module') ||
      event.message?.includes('dynamically imported module') ||
      event.message?.includes('error loading dynamically imported module')
    ) {
      handleChunkLoadFailure();
      return;
    }

    storage.addLog({
      level: 'error',
      source: 'Global Window Error',
      message: event.message || 'خطای ناشناخته در اجرا',
      details: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`
    });
  });

  // Override console.error to also log to our system
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    // Call the original first
    originalConsoleError.apply(console, args);

    // Skip React warning logs if needed, or just log everything
    const message = args.map(arg => 
      typeof arg === 'object' ? (arg instanceof Error ? arg.message : JSON.stringify(arg)) : String(arg)
    ).join(' ');

    if (
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('dynamically imported module') ||
      message.includes('error loading dynamically imported module')
    ) {
      handleChunkLoadFailure();
      return;
    }

    // Filter out some noisy React internal errors if you want, but for now we log them
    if (message.includes('Warning:')) return;

    storage.addLog({
      level: 'warning',
      source: 'Console Error',
      message: message.substring(0, 200), // truncate if too long
      details: args.map(a => typeof a === 'object' && a instanceof Error ? a.stack : '').filter(Boolean).join('\n')
    });
  };
};
