import axios from 'axios';
import dotenv from 'dotenv';
import * as HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import respond from './common';

dotenv.config();

const ISSUES_URL = process.env.ISSUES_URL || 'http://localhost:5060';
const adapter = axios.create({
  baseURL: ISSUES_URL,
});

/**
 * @method GET /project/?name=""
 * @description getProject is a get request for the '/project' route used to get a project by it's name.
 *
 * Response is the project fetched from the database or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.get(req.originalUrl);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST /project
 * @description postProject is a post request for the '/project' route used to create a project.
 *
 * Response is the project created or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const postProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.post(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method DELETE /project
 * @description deleteProject is a delete request for the '/project' route used to delete a project.
 *
 * Response is the boolean if the project was deleted or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const putUpdateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.put(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};


/**
 * @method DELETE /project
 * @description deleteProject is a delete request for the '/project' route used to delete a project.
 *
 * Response is the boolean if the project was deleted or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.delete(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};
