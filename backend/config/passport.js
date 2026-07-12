const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    console.log(`[AUTH DEBUG] Attempting login for email: ${email}`);
    const formattedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: formattedEmail } });
    if (!user) {
      console.log(`[AUTH DEBUG] User not found for email: ${email}`);
      return done(null, false, { message: 'User not found' });
    }

    console.log(`[AUTH DEBUG] User found. Checking password match...`);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[AUTH DEBUG] Password match result: ${isMatch}`);
    
    if (!isMatch) return done(null, false, { message: 'Incorrect password' });

    console.log(`[AUTH DEBUG] Login successful for email: ${email}`);
    return done(null, user);
  } catch (err) {
    console.error(`[AUTH DEBUG] Error during login:`, err);
    return done(err);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
