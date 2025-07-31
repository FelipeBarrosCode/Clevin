import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const authMiddleware = (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    // Check if it starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization format. Use Bearer token' });
    }

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log("Extracted token:", token.substring(0, 50) + "...");

    // For Supabase JWT tokens, they might be raw JWT or wrapped in JSON
    let tokenToVerify = token;
    
    // Verify the JWT token
    const decoded = jwt.verify(tokenToVerify, process.env.JWT_SECRET);
    console.log("Token decoded successfully for user:", decoded.sub);
    
    if (!req.locals) {
      req.locals = {};
    }
    console.log("decoded", decoded);
    req.locals.user = decoded;
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default authMiddleware; 