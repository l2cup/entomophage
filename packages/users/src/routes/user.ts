import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import { UserDocument, UserModel } from '@entomophage/common';
import { userService } from '../services';

/**
 * @method POST /register /user
 * @description postRegister is a post request for the '/register' route.
 * It takes it's parameters from a body and tries to register a new user
 *
 * Response is a user object that was created or it throws an error.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const postRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body.username === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Username not provided.' });
      return;
    }
    if (req.body.email === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Email not provided.' });
      return;
    }
    if (req.body.password === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Password not provided.' });
      return;
    }
    let user = await userService.getUserByEmail(req.body.email);
    if (user != null) {
      res.status(HttpStatus.CONFLICT).json({ error: 'User already exists.' });
      return;
    }
    user = await userService.createUser(req.body.username, req.body.email, req.body.password);
    if (user == null) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error creating the user.' });
      return;
    }
    res.status(HttpStatus.OK).json({ user: user as UserModel });
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST /login
 * @description postLogin is a post request for the '/login' route.
 * It takes it's parameters from a body and tries to login a new user
 *
 * Response is a boolean if the user is authorized and an error if it exists.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */

export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body.username === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No username provided.', authorization: false });
      return;
    }
    if (req.body.password === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No password provided.', authorization: false });
      return;
    }
    const user = await userService.getUserByUsername(req.body.username);
    const userModel = user as UserModel;
    if (user == null) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found.', authorization: false });
      return;
    }
    const isMatch = await user.comparePassword(req.body.password);

    if (isMatch === false) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Authorization failed.', authorization: false });
      return;
    }

    res.status(HttpStatus.OK).json({ authorization: true, user: userModel });
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method PUT /user
 * @description putUpdateUser is a post request for the '/user' route.
 * It takes the body and tries to find if the user exists. If it does it updates the user with the passed values.
 *
 * Response is either the updated user or an error if no user was found.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */

export const putUpdateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body.username === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Username not provided' });
      return;
    }
    const user = await userService.updateUser(req.body);
    if (user == null) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found.' });
      return;
    }
    res.status(HttpStatus.OK).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET /user/?username="", /user/?email="email" , /user/?id="id"
 * @description getUser is a get request to get a user either from
 * an email or an id provided in a get request.
 * It is all stored in one function for now, if needed will later be replaced
 * with different functions for different routes.
 *
 * Response is the user fetched from the database or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let user: UserDocument | null;

    if (req.query.username !== undefined) {
      user = await userService.getUserByUsername(req.query.username as string);
    } else if (req.query.email !== undefined) {
      user = await userService.getUserByEmail(req.query.email as string);
    } else if (req.query.id !== undefined) {
      user = await userService.getUserById(req.query.id as string);
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No arguments in query provided. Please provide either an id or an email.' });
      return;
    }

    if (user == null) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found.' });
      return;
    }
    res.status(HttpStatus.OK).json(user);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method DELETE /user
 * @description deleteUser is a delete request for the '/user' route.
 * It takes it's parameter from a body and tries to delete a user.
 *
 * Response is a boolean indicating if the user was deleted and an error message if it isn't.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body.username === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No username provided.', deleted: false });
      return;
    }
    const deleted: boolean = await userService.deleteUser(req.body.username);
    if (!deleted) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found.', deleted: false });
      return;
    }
    res.status(HttpStatus.OK).json({ deleted: true });
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET /users/?teamid='', /users/?teamname=''
 * @description getAllUsersFromTeam is a get request to get all users from a team.
 * If no team user with that name is found, or the team doesn't exist it will return
 * the appropriate error in the response.
 *
 * Response is the user array fetched from the database or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getAllUsersFromTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let users: UserDocument[] = [];
    if (req.query.teamname !== undefined) {
      users = await userService.getUsersByTeamName(req.query.teamname as string);
    } else {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No arguments in query provided. Please provide either a team name' });
      return;
    }
    res.status(HttpStatus.OK).json(users);
    return;
  } catch (err) {
    next(err);
  }
};
