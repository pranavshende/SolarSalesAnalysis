const { processFile } = require('../services/dataProcessor');
const fs = require('fs');
const path = require('path');

const uploadData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an Excel or CSV file' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).substring(1).toLowerCase();
    
    if (fileExtension !== 'xlsx' && fileExtension !== 'csv') {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Only .xlsx and .csv files are supported' });
    }

    const result = await processFile(filePath, fileExtension, req.user.id);

    // Clean up temporary file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'Data uploaded and processed successfully',
      version: result.version,
      recordsCount: result.count
    });

    // Notify clients via Socket.IO (to be implemented later in server.js)
    if (req.app.get('socketio')) {
      req.app.get('socketio').emit('DATA_UPDATED', { version: result.version });
    }

  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadData };
