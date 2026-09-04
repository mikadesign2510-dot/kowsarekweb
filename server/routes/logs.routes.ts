import { Router, Request, Response } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

// دریافت لاگ‌های امنیتی (فقط مدیر ارشد)
router.get('/', requireAuth, requireRole(['super_admin']), async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM security_logs ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت لاگ‌ها' });
  }
});

export default router;
