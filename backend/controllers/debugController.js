const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const restartMLService = (req, res) => {
  console.log('Restarting ML Service via Debug Menu...');
  
  // Command to start ML service (adjust path as needed)
  const mlDir = path.resolve(__dirname, '../../ml-service');
  const pythonPath = path.join(mlDir, '.venv/Scripts/python.exe');
  const command = `"${pythonPath}" -m uvicorn main:app --port 8000`;

  // We use exec but don't wait for it to finish as uvicorn is long-running
  const process = exec(command, { cwd: mlDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`ML Restart Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`ML Restart Stderr: ${stderr}`);
      return;
    }
    console.log(`ML Restart Stdout: ${stdout}`);
  });

  res.json({ message: 'ML Service restart command issued. Please wait a few seconds.', status: 'processing' });
};

const getSystemStats = (req, res) => {
  const os = require('os');
  res.json({
    platform: os.platform(),
    uptime: os.uptime(),
    memory: {
      total: os.totalmem(),
      free: os.freemem()
    },
    load: os.loadavg()
  });
};

const getLogs = (req, res) => {
  // Return a mock or read from a log file if exists
  res.json({
    logs: [
      `[${new Date().toISOString()}] System initialized`,
      `[${new Date().toISOString()}] Connected to PostgreSQL`,
      `[${new Date().toISOString()}] ML Service heartbeat detected`,
    ]
  });
};

module.exports = { restartMLService, getSystemStats, getLogs };
