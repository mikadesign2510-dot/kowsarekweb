import React, { useState, useEffect } from 'react';
import { storage, SystemLog } from '../../lib/storage';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { 
  Activity, 
  AlertTriangle, 
  Bug, 
  Trash2, 
  CheckCircle2, 
  Search, 
  XCircle, 
  Info, 
  RefreshCw, 
  Wrench, 
  FlaskConical, 
  HardDrive, 
  ShieldCheck, 
  Check, 
  Zap,
  Terminal,
  Sparkles,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Copy,
  Share2,
  Database,
  Gauge,
  Lock,
  Layers,
  Clock,
  Cpu,
  Server
} from 'lucide-react';

export default function AdminSystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'error'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Diagnostic state
  const [diagReport, setDiagReport] = useState<ReturnType<typeof storage.runSystemDiagnostics> | null>(null);
  const [isRunningDiag, setIsRunningDiag] = useState(false);
  const [repairResults, setRepairResults] = useState<string[] | null>(null);

  // Delete Confirmation states
  const [logToDelete, setLogToDelete] = useState<SystemLog | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  const loadLogs = () => {
    setLogs(storage.getLogs());
  };

  useEffect(() => {
    loadLogs();
    runDiagnostics();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleResolve = (id: string) => {
    storage.updateLogStatus(id, 'resolved');
    loadLogs();
    showToast('وضعیت خطا با موفقیت به «رفع شده» تغییر یافت.', 'success');
  };

  const confirmDeleteSingleLog = () => {
    if (!logToDelete) return;
    const id = logToDelete.id;
    setLogToDelete(null);
    storage.deleteLog(id);
    loadLogs();
    runDiagnostics();
    showToast('لاگ مورد نظر با موفقیت حذف گردید.', 'info');
  };

  const confirmClearAllLogs = () => {
    setShowClearAllConfirm(false);
    storage.clearLogs();
    loadLogs();
    runDiagnostics();
    showToast('تمامی لاگ‌های سیستم پاکسازی شدند.', 'info');
  };

  const runDiagnostics = () => {
    setIsRunningDiag(true);
    setTimeout(() => {
      const report = storage.runSystemDiagnostics();
      setDiagReport(report);
      setIsRunningDiag(false);
    }, 400);
  };

  const handleAutoRepair = () => {
    const fixes = storage.autoRepairSystem();
    setRepairResults(fixes);
    loadLogs();
    runDiagnostics();
    showToast('عملیات تعمیر خودکار و بازیابی ساختار با موفقیت انجام شد.', 'success');
  };

  // Log Export Handlers
  const downloadBlob = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      systemHealth: diagReport?.overallHealth || 'unknown',
      totalLogs: filteredLogs.length,
      logs: filteredLogs
    };
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadBlob(jsonStr, `kowsar-system-logs-${dateStr}.json`, 'application/json;charset=utf-8;');
    setShowExportMenu(false);
    showToast('فایل JSON لاگ‌ها با موفقیت دانلود شد.', 'success');
  };

  const handleExportCSV = () => {
    const headers = ['شناسه (ID)', 'سطح خطا (Level)', 'منبع (Source)', 'پیام خطا (Message)', 'زمان (Timestamp)', 'وضعیت (Status)'];
    const rows = filteredLogs.map(l => [
      `"${l.id}"`,
      `"${l.level}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${new Date(l.timestamp).toLocaleString('fa-IR')}"`,
      `"${l.status === 'resolved' ? 'بررسی شده' : 'حل نشده'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadBlob(csvContent, `kowsar-system-logs-${dateStr}.csv`, 'text/csv;charset=utf-8;');
    setShowExportMenu(false);
    showToast('فایل اکسل/CSV لاگ‌ها با موفقیت دانلود شد.', 'success');
  };

  const handleExportTextReport = () => {
    const dateStr = new Date().toLocaleDateString('fa-IR');
    const timeStr = new Date().toLocaleTimeString('fa-IR');
    let report = `=======================================================\n`;
    report += `گزارش جامع پایش و عیب‌یابی سامانه حوزه علمیه خواهران کوثر\n`;
    report += `تاریخ تولید گزارش: ${dateStr} - ساعت: ${timeStr}\n`;
    report += `وضعیت کلی سلامت سیستم: ${diagReport?.overallHealth === 'excellent' ? 'عالی و پایدار' : diagReport?.overallHealth === 'warning' ? 'نیازمند بررسی' : 'بحرانی'}\n`;
    report += `تعداد کل لاگ‌های موجود: ${logs.length} | خطاهای حل نشده: ${logs.filter(l => l.status === 'unresolved').length}\n`;
    report += `=======================================================\n\n`;

    filteredLogs.forEach((l, idx) => {
      report += `[${idx + 1}] سطح: ${l.level.toUpperCase()} | وضعیت: ${l.status === 'resolved' ? 'رفع شده' : 'حل نشده'}\n`;
      report += `منبع: ${l.source}\n`;
      report += `زمان: ${new Date(l.timestamp).toLocaleString('fa-IR')}\n`;
      report += `پیام: ${l.message}\n`;
      if (l.details) {
        report += `جزئیات / Stack Trace:\n${l.details}\n`;
      }
      report += `-------------------------------------------------------\n`;
    });

    const fileDate = new Date().toISOString().slice(0, 10);
    downloadBlob(report, `kowsar-system-report-${fileDate}.txt`, 'text/plain;charset=utf-8;');
    setShowExportMenu(false);
    showToast('گزارش متنی جامع سیستم با موفقیت تولید و دانلود شد.', 'success');
  };

  const handleCopyToClipboard = async () => {
    try {
      const summaryText = filteredLogs.map((l, i) => 
        `[#${i+1}] [${l.level.toUpperCase()}] (${new Date(l.timestamp).toLocaleString('fa-IR')}) ${l.source}: ${l.message}${l.details ? `\nStack: ${l.details}` : ''}`
      ).join('\n\n');
      
      await navigator.clipboard.writeText(summaryText);
      setShowExportMenu(false);
      showToast('خلاصه لاگ‌ها در کلیپ‌بورد کپی شد (مناسب ارسال به پشتیبانی).', 'success');
    } catch {
      showToast('خطا در دسترسی به کلیپ‌بورد', 'error');
    }
  };

  // Simulation test functions
  const triggerSimulation = (type: 'runtime' | 'console' | 'critical') => {
    if (type === 'runtime') {
      // Simulate unhandled promise / runtime error
      const mockError = new Error('خطای شبیه‌سازی شده در بارگذاری سرویس: اختلال در پاسخگویی شبکه');
      storage.addLog({
        level: 'error',
        source: 'Unhandled Promise Rejection (آزمایشی)',
        message: mockError.message,
        details: `Stack Trace:\nError: ${mockError.message}\n  at fetchServiceStatus (https://kowsar-kaki.ac.ir/src/services/api.ts:48:12)\n  at async loadDashboardData (https://kowsar-kaki.ac.ir/src/pages/Home.tsx:112:5)`
      });
      showToast('یک خطای Runtime آزمایشی ثبت شد! به لیست لاگ‌ها اضافه گردید.', 'error');
    } else if (type === 'console') {
      // Simulate console error logging
      storage.addLog({
        level: 'warning',
        source: 'Console Error (آزمایشی)',
        message: 'هشدار شبیه‌سازی شده: تلاش برای خواندن فیلد نامعتبر در ماژول ثبت‌نام',
        details: 'Console Warning captured:\nWarning: Invalid property access detected in RegistrationForm at src/pages/Registration.tsx:88:14'
      });
      showToast('یک هشدار شبیه‌سازی شده کنسول با موفقیت ثبت شد.', 'info');
    } else if (type === 'critical') {
      // Simulate critical crash
      storage.addLog({
        level: 'critical',
        source: 'React ErrorBoundary (آزمایشی)',
        message: 'خطای بحرانی رندر کامپوننت اسلایدر: ساختار بنر نامعتبر است',
        details: `TypeError: Cannot read properties of undefined (reading 'imageUrl')\n  at BannerSlider.render (src/components/BannerSlider.tsx:34:18)\n  at ErrorBoundary.componentDidCatch (src/components/ErrorBoundary.tsx:24:5)`
      });
      showToast('خطای بحرانی آزمایشی ایجاد شد! به شمارنده خطاهای حل‌نشده توجه کنید.', 'error');
    }

    loadLogs();
    runDiagnostics();
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'unresolved' && log.status !== 'unresolved') return false;
    if (filter === 'error' && log.level !== 'error' && log.level !== 'critical') return false;
    if (searchTerm) {
      return log.message.includes(searchTerm) || log.source.includes(searchTerm);
    }
    return true;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Activity className="w-5 h-5 text-slate-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'critical': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold">بحرانی (Critical)</span>;
      case 'error': return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">خطا (Error)</span>;
      case 'warning': return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">هشدار (Warning)</span>;
      case 'info': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">اطلاع (Info)</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 left-6 z-50 px-6 py-4 rounded-2xl shadow-xl border flex items-center gap-3 transition-all animate-bounce ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-800 text-white border-emerald-700' 
            : toastMessage.type === 'error'
            ? 'bg-red-700 text-white border-red-600'
            : 'bg-slate-800 text-white border-slate-700'
        }`}>
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
          {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-amber-300" />}
          {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-300" />}
          <span className="font-bold text-sm">{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            مرکز مانیتورینگ، خطایابی و تست سلامت سامانه
          </h1>
          <p className="text-slate-500 font-medium">پایش لحظه‌ای خطاهای رندر، خطاهای سراسری کلاینت و ابزار عیب‌یابی و بازیابی خودکار</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative">
          {/* Export Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors shadow-sm font-bold text-sm"
            >
              <Download className="w-4 h-4" />
              <span>خروجی و دانلود</span>
              <span className="text-xs bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded-full">
                {filteredLogs.length}
              </span>
            </button>

            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-400">
                    فرمت‌های خروجی ({filteredLogs.length} مورد فیلتر شده)
                  </div>
                  
                  <button
                    onClick={handleExportJSON}
                    className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <FileJson className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold">دانلود فایل استاندارد JSON</p>
                      <p className="text-[10px] text-slate-400 font-normal">داده کامل با تمام جزییات و متادیتا</p>
                    </div>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold">دانلود اکسل / CSV (جدولی)</p>
                      <p className="text-[10px] text-slate-400 font-normal">قابل بازگشایی در اکسل با فونت فارسی</p>
                    </div>
                  </button>

                  <button
                    onClick={handleExportTextReport}
                    className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold">گزارش متنی تفصیلی سلامت (.txt)</p>
                      <p className="text-[10px] text-slate-400 font-normal">شامل مشخصات سلامت و زمان‌بندی</p>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={handleCopyToClipboard}
                    className="w-full text-right px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Copy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-slate-800 font-bold">کپی سریع در کلیپ‌بورد</p>
                      <p className="text-[10px] text-slate-400 font-normal">مناسب ارسال فوری در تیکت پشتیبانی</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={loadLogs}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-bold text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            بروزرسانی
          </button>
          <button 
            type="button"
            onClick={() => setShowClearAllConfirm(true)}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors font-bold text-sm"
          >
            <Trash2 className="w-4 h-4" />
            پاکسازی لاگ‌ها
          </button>
        </div>
      </div>

      {/* Interactive Testing & Simulation Center */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-7 rounded-3xl shadow-lg border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  شبیه‌ساز و تست زنده کارکرد ابزار عیب‌یابی (Live Test Center)
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    فعال و آماده تست
                  </span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">برای اطمینان از عملکرد سیستم ثبت خطا، روی دکمه‌های زیر کلیک کنید تا خطا به صورت زنده شبیه‌سازی و ثبت شود:</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => triggerSimulation('runtime')}
              className="group p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-orange-500/50 rounded-2xl text-right transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    تست ۱
                  </span>
                  <Zap className="w-4 h-4 text-orange-400 group-hover:scale-125 transition-transform" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">شبیه‌سازی خطای جاوااسکریپت (Runtime / Promise)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تولید خطای قطعی شبکه یا اختلال در Promise و ثبت فوری آن در دیتابیس لاگ.
                </p>
              </div>
              <div className="mt-3 text-xs font-bold text-orange-400 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                <span>اجرای تست خطای Runtime</span>
                <span>←</span>
              </div>
            </button>

            <button
              onClick={() => triggerSimulation('console')}
              className="group p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-2xl text-right transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    تست ۲
                  </span>
                  <Terminal className="w-4 h-4 text-amber-400 group-hover:scale-125 transition-transform" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">شبیه‌سازی خطای کنسول (Console.error)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  بررسی تله‌گذار اختصاصی `console.error` و ذخیره خودکار آن به عنوان Warning.
                </p>
              </div>
              <div className="mt-3 text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                <span>اجرای تست Console Error</span>
                <span>←</span>
              </div>
            </button>

            <button
              onClick={() => triggerSimulation('critical')}
              className="group p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-red-500/50 rounded-2xl text-right transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    تست ۳
                  </span>
                  <XCircle className="w-4 h-4 text-red-400 group-hover:scale-125 transition-transform" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">شبیه‌سازی خطای بحرانی (Critical / Crash)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  تولید خطای نوع Critical با Stack Trace کامل جهت بررسی عملکرد ErrorBoundary.
                </p>
              </div>
              <div className="mt-3 text-xs font-bold text-red-400 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                <span>اجرای تست خطای بحرانی</span>
                <span>←</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System Diagnostics & Auto-Repair Section */}
      {diagReport && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  وضعیت سلامت و یکپارچگی پایگاه داده سیستم (System Health Diagnostics)
                </h3>
                <p className="text-slate-500 text-xs">
                  حجم مصرفی حافظه لوکال: <span className="font-bold text-slate-700" dir="ltr">{diagReport.storageUsedKb} KB</span> | تعداد کل جداول: <span className="font-bold text-slate-700">{diagReport.storageItemsCount}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runDiagnostics}
                disabled={isRunningDiag}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiag ? 'animate-spin' : ''}`} />
                اسکن مجدد سلامت
              </button>

              <button
                onClick={handleAutoRepair}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                <Wrench className="w-3.5 h-3.5" />
                تعمیر خودکار و ترمیم ساختار (Auto-Repair)
              </button>
            </div>
          </div>

          {/* Module Health Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {diagReport.modulesStatus.map((mod, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <div className="mt-0.5">
                  {mod.status === 'healthy' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate">{mod.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                      {mod.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{mod.message}</p>
                </div>
              </div>
            ))}
          </div>

          {repairResults && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-medium space-y-1">
              <div className="font-bold flex items-center gap-1 text-emerald-900 mb-1">
                <Sparkles className="w-4 h-4" />
                نتیجه عملیات تعمیر خودکار و عیب‌یابی:
              </div>
              {repairResults.length === 0 ? (
                <p>تمامی ساختارهای پایگاه داده سالم بودند و هیچ نقص ساختاری مشاهده نشد.</p>
              ) : (
                repairResults.map((res, idx) => (
                  <p key={idx}>• {res}</p>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Filters and Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm md:col-span-1">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              logs.filter(l => l.status === 'unresolved').length > 0
                ? 'bg-red-50 text-red-500 animate-pulse'
                : 'bg-emerald-50 text-emerald-500'
            }`}>
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">خطاهای حل‌نشده</p>
              <p className="text-2xl font-black text-slate-800">
                {logs.filter(l => l.status === 'unresolved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm md:col-span-3 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="جستجو در عنوان، منبع و متن لاگ‌ها..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              همه ({logs.length})
            </button>
            <button 
              onClick={() => setFilter('unresolved')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'unresolved' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              حل‌نشده ({logs.filter(l => l.status === 'unresolved').length})
            </button>
            <button 
              onClick={() => setFilter('error')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'error' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              فقط خطا و بحرانی ({logs.filter(l => l.level === 'error' || l.level === 'critical').length})
            </button>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">سیستم در وضعیت سالم است</h3>
            <p className="text-slate-500 text-sm max-w-md">
              هیچ لاگی با فیلترهای فعلی وجود ندارد. می‌توانید با استفاده از «شبیه‌ساز و تست زنده» در بالای صفحه، عملکرد ثبت خطا را امتحان کنید.
            </p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div 
              key={log.id} 
              className={`bg-white rounded-2xl border ${
                log.status === 'unresolved' && (log.level === 'critical' || log.level === 'error')
                  ? 'border-red-200 bg-red-50/10 shadow-sm' 
                  : log.status === 'unresolved'
                  ? 'border-amber-200 shadow-sm'
                  : 'border-slate-100'
              } p-5 transition-all hover:shadow-md`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                
                <div className="flex-shrink-0 pt-1">
                  {getLevelIcon(log.level)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getLevelBadge(log.level)}
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {log.source}
                    </span>
                    <span className="text-xs text-slate-400 font-medium" dir="ltr">
                      {new Date(log.timestamp).toLocaleString('fa-IR')}
                    </span>
                    {log.status === 'resolved' && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        بررسی و رفع شده
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-base font-bold text-slate-800 mb-2 break-words">{log.message}</h4>
                  
                  {log.details && (
                    <div className="mt-3 bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto text-left leading-relaxed" dir="ltr">
                      <pre>{log.details}</pre>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 mt-4 md:mt-0 flex flex-col sm:flex-row items-stretch md:items-center gap-2">
                  {log.status === 'unresolved' && (
                    <button 
                      onClick={() => handleResolve(log.id)}
                      className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-2 rounded-xl transition-colors font-bold text-xs border border-emerald-200/60"
                      title="تغییر وضعیت به رفع شده"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      رفع شده
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => setLogToDelete(log)}
                    className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl transition-colors font-bold text-xs border border-red-200/60"
                    title="حذف کامل این رکورد لاگ"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Single Log Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(logToDelete)}
        onClose={() => setLogToDelete(null)}
        onConfirm={confirmDeleteSingleLog}
        title="حذف رکورد لاگ سیستم"
        itemName={logToDelete?.message}
        details={logToDelete ? [
          { label: 'منبع رویداد', value: logToDelete.source },
          { label: 'سطح اهمیت', value: logToDelete.level }
        ] : undefined}
      />

      {/* Clear All Logs Modal */}
      <DeleteConfirmModal
        isOpen={showClearAllConfirm}
        onClose={() => setShowClearAllConfirm(false)}
        onConfirm={confirmClearAllLogs}
        title="پاکسازی تمامی لاگ‌های سیستم"
        itemCount={logs.length}
        confirmText="بله، همه لاگ‌ها پاکسازی شوند"
      />
    </div>
  );
}
