import jwt from 'jsonwebtoken';
import * as HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { SECRET } = process.env || 'SECRET';

export const authorize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.headers.authorization && !req.headers['x-jwt-token']) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized.' });
      return;
    }
    /* req.headers['x-jwt-token'] is actually a string if it exists not a string[] so we cast as string */
    const token: string = req.headers.authorization || req.headers['x-jwt-token'] as string;
    const decoded = jwt.verify(token, SECRET as string);
    if (decoded != null) next();
  } catch (err) {
    res.status(HttpStatus.FORBIDDEN).json({ error: err });
  }
};

export const makeToken = (username: string): string => jwt.sign({ username }, SECRET as string, { expiresIn: 86400 });
