import axios from 'axios';
import dotenv from 'dotenv';
import * as HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '@entomophage/common';
import * as auth from '../auth';
import respond from './common';

dotenv.config();

const USERS_URL = process.env.USERS_URL || 'http://localhost:5050';
const adapter = axios.create({
  baseURL: USERS_URL,
});

/**
 * @method POST /login
 * @description postLogin is a post request for the '/login' route.
 * It reroutes to the user service, on the same route.
 *
 * Response is a token if the authorization was succesful.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.headers.authorization != null || req.headers['x-jwt-token'] != null) {
      auth.authorize(req, res, next);
      return;
    }
    const serviceResponse = await adapter.post(req.path, req.body);
    if (serviceResponse.data.authorization == null) {
      res.status(HttpStatus.UNAUTHORIZED).json({ authorization: false, token: null });
      return;
    }
    if (!serviceResponse.data.authorization) {
      res.status(HttpStatus.UNAUTHORIZED).json({ authorization: false, token: null });
      return;
    }
    if (req.body.username === undefined) {
      res.status(HttpStatus.UNAUTHORIZED).json({ authorization: false, token: null });
      return;
    }
    const token = auth.makeToken(req.body.username);
    const userModel = serviceResponse.data.user as UserModel;
    res.status(HttpStatus.OK).json({ authorization: true, token, user: userModel });
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST /register /user
 * @description postRegister is a post request for the '/register' route.
 * It reroutes to the user service, on the same route.
 *
 * Response is a token if the registration was succesful.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const postRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.post(req.path, req.body);
    if (serviceResponse.data.error != null || serviceResponse.data.user == null) {
      res.status(serviceResponse.status).json({ error: serviceResponse.data.error });
      return;
    }
    const token = auth.makeToken(serviceResponse.data?.user?.username);
    if (token == null) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error creating token.' });
      return;
    }
    res.status(HttpStatus.OK).json({ token, user: serviceResponse.data.user });
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
    const serviceResponse = await adapter.get(req.originalUrl);
    await respond(serviceResponse, req, res);
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
    const serviceResponse = await adapter.delete(req.path, req.body);
    await respond(serviceResponse, req, res);
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
    const serviceResponse = await adapter.put(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
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
    const serviceResponse = await adapter.get(req.originalUrl);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};
