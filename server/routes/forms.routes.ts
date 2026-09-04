import { Router, Request, Response } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// دریافت لیست فرم‌ها
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM forms ORDER BY is_pinned DESC, priority ASC, created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت فرم‌ها' });
  }
});

// افزایش شمارنده دانلود فرم
router.post('/:id/download', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('UPDATE forms SET download_count = download_count + 1 WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'خطا در ثبت دانلود' });
  }
});

// ذخیره / همگام‌سازی فرم‌ها
router.post('/sync', requireAuth, async (req: Request, res: Response) => {
  try {
    const { forms } = req.body;
    if (!Array.isArray(forms)) {
      return res.status(400).json({ success: false, message: 'اطلاعات نامعتبر است' });
    }

    await pool.query('DELETE FROM forms');

    for (const f of forms) {
      await pool.query(
        `INSERT INTO forms (
          id, code, title, description, category, department,
          file_format, file_size, file_url, download_count,
          is_published, is_pinned, priority, created_at, updated_at,
          tags, instructions, required_attachments,
          item_type, professor_name, field_of_study, degree_level,
          academic_term, page_count, course_code
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)`,
        [
          f.id || `form-${Date.now()}-${Math.random()}`,
          f.code || 'FORM-100',
          f.title,
          f.description || '',
          f.category || 'عمومی',
          f.department || 'آموزش',
          f.fileFormat || 'PDF',
          f.fileSize || '1 MB',
          f.fileUrl || '',
          f.downloadCount || 0,
          f.isPublished ?? true,
          f.isPinned ?? false,
          f.priority || 1,
          f.createdAt || new Date().toLocaleDateString('fa-IR'),
          f.updatedAt || new Date().toLocaleDateString('fa-IR'),
          JSON.stringify(f.tags || []),
          JSON.stringify(f.instructions || []),
          JSON.stringify(f.requiredAttachments || []),
          f.itemType || (f.category?.includes('جزوه') ? 'pamphlet' : 'form'),
          f.professorName || null,
          f.fieldOfStudy || null,
          f.degreeLevel || null,
          f.academicTerm || null,
          f.pageCount || null,
          f.courseCode || null
        ]
      );
    }

    res.json({ success: true, message: 'فرم‌ها با موفقیت در دیتابیس ثبت شدند' });
  } catch (error) {
    console.error('Error syncing forms:', error);
    res.status(500).json({ success: false, message: 'خطا در ذخیره فرم‌ها' });
  }
});

export default router;
