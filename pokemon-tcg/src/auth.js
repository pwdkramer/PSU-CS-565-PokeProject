import express from 'express';

const cookieName = 'poke_session';
const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export function installAuth(app, db) {
  app.use('/api', express.json({ limit: '4kb' }));
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    // Reject cross-origin mutations, including requests from sibling sites.
    if (req.method === 'POST' && req.headers.origin && req.headers.origin !== `${req.protocol}://${req.get('host')}`) {
      return res.status(403).json({ payload: 'Request origin is not allowed.' });
    }
    const cookie = (req.headers.cookie ?? '').split(';').map((part) => part.trim())
      .find((part) => part.startsWith(`${cookieName}=`));
    req.sessionToken = cookie?.slice(cookieName.length + 1);
    req.user = db.getSessionUser(req.sessionToken);
    next();
  });

  const signIn = (req, res, user, status = 200) => {
    db.deleteSession(req.sessionToken);
    res.cookie(cookieName, db.createSession(user), { ...cookieOptions, maxAge: 86400000 });
    return res.status(status).json({ payload: user });
  };

  app.post('/api/auth/register', (req, res) => {
    const { username, password, confirmPassword } = req.body ?? {};
    if (!db.isValidUsername(username) || !db.isValidPassword(password)) {
      return res.status(400).json({ payload: 'Use a username of 3–24 letters, numbers, or underscores and a password of 8–128 characters.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ payload: 'Passwords do not match.' });
    }
    const user = db.insertNewUser(username, password);
    if (!user) return res.status(409).json({ payload: 'That username is already taken.' });
    return signIn(req, res, user, 201);
  });

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body ?? {};
    const user = db.validateLogin(username, password);
    if (!user) return res.status(401).json({ payload: 'Incorrect username or password.' });
    return signIn(req, res, user);
  });

  app.post('/api/auth/reset-password', (req, res) => {
    const { username, password, confirmPassword } = req.body ?? {};
    if (!db.isValidUsername(username) || !db.isValidPassword(password)) {
      return res.status(400).json({ payload: 'Enter a valid username and a password of 8–128 characters.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ payload: 'Passwords do not match.' });
    }
    if (!db.resetPassword(username, password)) {
      return res.status(404).json({ payload: 'No account was found with that username.' });
    }
    if (req.user?.username === username) res.clearCookie(cookieName, cookieOptions);
    return res.json({ payload: 'Password updated. Log in with your new password.' });
  });

  app.get('/api/auth/me', (req, res) => {
    if (!req.user) return res.status(401).json({ payload: 'Please log in.' });
    return res.json({ payload: req.user });
  });

  app.post('/api/auth/logout', (req, res) => {
    db.deleteSession(req.sessionToken);
    res.clearCookie(cookieName, cookieOptions);
    return res.json({ payload: null });
  });

  app.use('/api', (req, res, next) => {
    if (!req.user) return res.status(401).json({ payload: 'Please log in.' });
    next();
  });
}
