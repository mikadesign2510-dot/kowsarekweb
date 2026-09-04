import rateLimit from 'express-rate-limit';

// محدود کننده درخواست (Rate Limiting) برای مسیر ورود جهت جلوگیری از حملات Brute Force
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ۱۵ دقیقه
  max: 100, // در محیط تستی به ۱۰۰ افزایش یافت تا مشکل تست پیش‌نمایش رخ ندهد (در پروداکشن به ۵ برگردانید)
  message: {
    success: false,
    message: 'تعداد درخواست‌های ورود بیش از حد مجاز است. لطفاً ۱۵ دقیقه دیگر تلاش کنید.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
    forwardedHeader: false,
    default: true,
  },
});
