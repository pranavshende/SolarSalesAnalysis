const express = require('express');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const { uploadData } = require('../controllers/dataController');
const authorize = require('../middleware/rbac');

const router = express.Router();

// Setup Multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!require('fs').existsSync(uploadPath)) {
      require('fs').mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post(
  '/upload', 
  passport.authenticate('jwt', { session: false }), 
  authorize(['Admin', 'Analyst']), 
  upload.single('file'), 
  uploadData
);

module.exports = router;
