const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

const signup = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const email = req.body.email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isVerified: true
      }
    });

    res.status(201).json({ 
      message: 'User created successfully. Please sign in.',
      email 
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`[AUTH] Verifying OTP for ${email}. Provided: ${otp}`);
    
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    
    const storedOtp = String(user.otp || '').trim();
    const providedOtp = String(otp || '').trim();
    const isExpired = user.otpExpires && new Date(user.otpExpires).getTime() < Date.now();

    if (storedOtp !== providedOtp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }
    
    if (isExpired) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null
      }
    });

    const token = generateToken(user);
    res.status(200).json({ 
      message: 'OTP verified successfully', 
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email }
    });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ message: err.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;
    const otpExpires = new Date(Date.now() + expiryMinutes * 60000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpires }
    });

    console.log(`[SIMULATED OTP] New code for ${email}: ${otp}`);

    res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (err) {
    console.error('Resend OTP Error:', err);
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const user = req.user;

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const token = generateToken(user);
    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, verifyOTP, resendOTP, login };
