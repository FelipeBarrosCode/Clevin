import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies['sb-elbdnefgkagyojjiahtv-auth-token'];
    const parsedToken = JSON.parse(token)
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    console.log("parsedToken", parsedToken)
    const decoded = jwt.verify(parsedToken.access_token, process.env.JWT_SECRET);
    if (!req.locals) {
      req.locals = {};
    }
    
    req.locals.user = decoded

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.log(error)
      return res.status(401).json({ error: 'Invalid token' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default authMiddleware; 