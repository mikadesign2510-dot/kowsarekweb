import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.js';

const router = Router();

// Ensure the uploads directory exists on the server
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Pre-create known section subdirectories
const DEFAULT_FOLDERS = ['banners', 'gallery', 'videos', 'news', 'forms', 'settings', 'portal', 'avatars', 'general'];
DEFAULT_FOLDERS.forEach(sub => {
  const p = path.join(UPLOADS_DIR, sub);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

// Helper to determine and create safe subfolder
const getTargetDir = (folderParam?: any) => {
  const rawFolder = String(folderParam || 'general').toLowerCase().trim();
  const safeFolder = rawFolder.replace(/[^a-z0-9_-]/g, '') || 'general';
  const targetDir = path.join(UPLOADS_DIR, safeFolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  return { targetDir, safeFolder };
};

// Allowed extensions and mimetypes
const ALLOWED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.jfif', '.bmp', '.tiff', '.tif', '.heic', '.heif', '.avif',
  '.pdf', '.docx', '.doc', '.xlsx', '.xls', '.csv',
  '.zip', '.rar', '.txt', '.mp4', '.webm', '.ogg'
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query.folder || req.headers['x-upload-folder'] || (req as any).body?.folder;
    const { targetDir } = getTargetDir(folder);
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // Generate safe filename: timestamp-random-originalName
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_')
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    cb(null, `${uniqueSuffix}-${baseName}${ext || '.jpg'}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB server limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // If extension is missing but mimetype is an image/video, allow it
    if (!ext && (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/'))) {
      return cb(null, true);
    }
    if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
      return cb(new Error(`فرمت فایل غیرمجاز است (${ext}). فرمت‌های مجاز: تصاویر، ویدیوها، اسناد PDF، Word، Excel و ZIP`));
    }
    cb(null, true);
  }
});

// Single file upload endpoint
router.post('/', (req: Request, res: Response) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      console.error('File upload middleware error:', err);
      return res.status(400).json({
        success: false,
        message: err instanceof multer.MulterError ? `خطای آپلود: ${err.message}` : (err.message || 'خطا در بارگذاری فایل')
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'هیچ فایلی برای بارگذاری ارسال نشده است'
        });
      }

      const folder = req.query.folder || req.headers['x-upload-folder'] || req.body?.folder;
      const { safeFolder } = getTargetDir(folder);
      const fileUrl = `/uploads/${safeFolder}/${req.file.filename}`;
      const fileSizeMB = (req.file.size / (1024 * 1024)).toFixed(2);

      res.json({
        success: true,
        message: 'فایل با موفقیت در پوشه اختصاصی سرور ذخیره گردید',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          sizeFormatted: `${fileSizeMB} مگابایت`,
          mimetype: req.file.mimetype,
          folder: safeFolder,
          url: fileUrl
        }
      });
    } catch (error: any) {
      console.error('File upload error:', error);
      res.status(500).json({
        success: false,
        message: error?.message || 'خطا در ذخیره‌سازی فایل'
      });
    }
  });
});

// Multiple files upload endpoint (for gallery or multi attachments)
router.post('/multiple', (req: Request, res: Response) => {
  upload.array('files', 30)(req, res, (err: any) => {
    if (err) {
      console.error('Multiple upload middleware error:', err);
      return res.status(400).json({
        success: false,
        message: err instanceof multer.MulterError ? `خطای آپلود گروهی: ${err.message}` : (err.message || 'خطا در بارگذاری فایل‌ها')
      });
    }

    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'هیچ فایلی برای بارگذاری ارسال نشده است'
        });
      }

      const folder = req.query.folder || req.headers['x-upload-folder'] || req.body?.folder;
      const { safeFolder } = getTargetDir(folder);

      const uploadedFiles = files.map(f => ({
        filename: f.filename,
        originalName: f.originalname,
        size: f.size,
        sizeFormatted: `${(f.size / (1024 * 1024)).toFixed(2)} مگابایت`,
        mimetype: f.mimetype,
        folder: safeFolder,
        url: `/uploads/${safeFolder}/${f.filename}`
      }));

      res.json({
        success: true,
        message: `${uploadedFiles.length} فایل با موفقیت در پوشه ${safeFolder} ذخیره شدند`,
        data: uploadedFiles
      });
    } catch (error: any) {
      console.error('Multiple file upload error:', error);
      res.status(500).json({
        success: false,
        message: error?.message || 'خطا در پردازش فایل‌ها'
      });
    }
  });
});

// List uploaded files (for admin dashboard / storage monitoring)
router.get('/list', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return res.json({ success: true, data: [] });
    }

    const fileNames = fs.readdirSync(UPLOADS_DIR);
    const files = fileNames.map(name => {
      const filePath = path.join(UPLOADS_DIR, name);
      const stat = fs.statSync(filePath);
      return {
        name,
        url: `/uploads/${name}`,
        size: stat.size,
        sizeFormatted: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
        createdAt: stat.birthtime
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error: any) {
    console.error('List uploads error:', error);
    res.status(500).json({ success: false, message: 'خطا در دریافت لیست فایل‌ها' });
  }
});


// Delete file endpoint
router.delete('/:folder/:filename', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const folder = String(req.params.folder || '');
    const filename = String(req.params.filename || '');
    // Basic security check to prevent directory traversal
    if (folder.includes('..') || filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ success: false, message: 'مسیر نامعتبر است' });
    }
    const safeFolder = folder.replace(/[^a-z0-9_-]/g, '');
    const filePath = path.join(UPLOADS_DIR, safeFolder, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'فایل با موفقیت حذف شد' });
    } else {
      res.status(404).json({ success: false, message: 'فایل یافت نشد' });
    }
  } catch (error: any) {
    console.error('Delete file error:', error);
    res.status(500).json({ success: false, message: 'خطا در حذف فایل' });
  }
});

export default router;

