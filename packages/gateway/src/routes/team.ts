import axios from 'axios';
import dotenv from 'dotenv';
import * as HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import respond from './common';

dotenv.config();

const USERS_URL = process.env.USERS_URL || 'http://localhost:5050';
const adapter = axios.create({
  baseURL: USERS_URL,
});

/**
 * @method GET /team/?name=""
 * @description getTeam is a get request for the '/team' route used to get a team by it's name.
 *
 * Response is the team fetched from the database or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.get(req.originalUrl);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST /team
 * @description postCreateTeam is a post request for the '/team' route.
 * It takes it's parameters from a body and tries to create a new team.
 *
 * Response is a team object that was created or it throws an error.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const postCreateTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.post(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method PUT /team
 * @description putUpdateTeam is a put request for the '/team' route.
 * It takes it's parameters from a body and tries to update a team
 *
 * Response is a team object that was updated or it throws an error.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const putUpdateTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.put(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method DELETE /team
 * @description deleteTeam is a delete request for the '/team' route.
 * It takes it's parameter from a body and tries to delete a team.
 *
 * Response is a boolean indicating if the team was deleted and an error message if it isn't.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const deleteTeam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.delete(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};
