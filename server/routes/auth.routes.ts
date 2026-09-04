import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { loginSchema } from '../validators/auth.schema.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.js';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kowsar_university_secure_jwt_secret_2026';

// مسیر لاگین مدیران با اتصال به پایگاه داده PostgreSQL و Zod و Bcrypt
router.post('/login', loginRateLimiter, async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    // ۱. اعتبارسنجی فرمت ورودی‌ها با Zod
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, errors: result.error.format() });
    }

    const { email, password } = result.data;
    const cleanIdentifier = email.trim().toLowerCase();
    const baseIdentifier = cleanIdentifier.split('@')[0];

    // ۲. واکشی کاربر از جدول users پایگاه داده با تطبیق نام کاربری و ایمیل
    const userQuery = await pool.query(
      `SELECT * FROM users 
       WHERE LOWER(email) = $1 
          OR LOWER(email) = $2 
          OR LOWER(email) = $3 
          OR LOWER(name) = $1 
          OR LOWER(name) = $3 
       LIMIT 1`,
      [cleanIdentifier, `${baseIdentifier}@kowsar.ac.ir`, baseIdentifier]
    );
    const user = userQuery.rows[0];

    if (!user) {
      // ثبت لاگ تلاش ناموفق
      await pool.query(
        'INSERT INTO security_logs (event_type, ip_address, user_agent, details) VALUES ($1, $2, $3, $4)',
        ['FAILED_LOGIN_EMAIL_NOT_FOUND', ip, userAgent, JSON.stringify({ email })]
      );
      return res.status(401).json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // ۳. بررسی صحت رمز عبور با الگوریتم Bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      // ثبت لاگ ورود ناموفق
      await pool.query(
        'INSERT INTO security_logs (event_type, ip_address, user_agent, details) VALUES ($1, $2, $3, $4)',
        ['FAILED_LOGIN_WRONG_PASSWORD', ip, userAgent, JSON.stringify({ email, userId: user.id })]
      );
      return res.status(401).json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // ۴. استخراج و تبدیل دسترسی‌های کاربر
    let userPermissions: string[] = [];
    if (Array.isArray(user.permissions)) {
      userPermissions = user.permissions;
    } else if (typeof user.permissions === 'string') {
      try {
        userPermissions = JSON.parse(user.permissions || '[]');
      } catch {
        userPermissions = [];
      }
    }

    // صدور توکن امنیتی JWT واقعی
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: userPermissions,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ۵. ثبت لاگ ورود موفق
    await pool.query(
      'INSERT INTO security_logs (event_type, ip_address, user_agent, details) VALUES ($1, $2, $3, $4)',
      ['SUCCESSFUL_LOGIN', ip, userAgent, JSON.stringify({ email: user.email, name: user.name, role: user.role, permissionsCount: userPermissions.length })]
    );

    // ۶. ارسال کوکی امن HttpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // ۷ روز
    });

    return res.json({
      success: true,
      message: 'ورود موفقیت‌آمیز بود',
      token,
      user: {
        id: user.id,
        name: user.name,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        nationalId: user.national_id || '',
        mobile: user.mobile || '',
        email: user.email,
        role: user.role,
        permissions: userPermissions,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'خطای داخلی سرور در پردازش لاگین' });
  }
});

// خروج از حساب کاربری
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'با موفقیت خارج شدید' });
});

// دریافت اطلاعات کاربر لاگین شده فعلی
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'کاربر احراز هویت نشده است' });
    }
    const result = await pool.query(
      'SELECT id, name, first_name AS "firstName", last_name AS "lastName", national_id AS "nationalId", mobile, email, role, permissions, created_at FROM users WHERE id = $1', 
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'کاربر یافت نشد' });
    }
    const u = result.rows[0];
    let userPerms: string[] = [];
    if (Array.isArray(u.permissions)) {
      userPerms = u.permissions;
    } else if (typeof u.permissions === 'string') {
      try {
        userPerms = JSON.parse(u.permissions || '[]');
      } catch {
        userPerms = [];
      }
    }
    res.json({ success: true, user: { ...u, permissions: userPerms } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در دریافت اطلاعات کاربر' });
  }
});

export default router;
