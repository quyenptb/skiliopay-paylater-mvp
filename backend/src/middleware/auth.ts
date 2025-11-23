import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const userIdHeader = req.headers['x-user-id'];
  
  if (!userIdHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing x-user-id header' });
  }

  
  (req as any).user = { id: userIdHeader.toString() };
  next();
};

export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
  const currentUserId = (req as any).user.id;
  const requestedUserId = req.params.userId || req.body.userId;

  if (requestedUserId && currentUserId !== requestedUserId) {
    return res.status(403).json({ error: 'Forbidden: You can only access your own data' });
  }
  next();
};