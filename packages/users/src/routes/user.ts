import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user';

async function postRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.body.email === undefined) next(new Error('Email not provided.'));
    const user = userService.getUserByEmail(req.body.email);
  } catch (err) {
    return err;
  }
}
