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
export const getIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.get(req.originalUrl);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST /issue
 * @description postIssue is a post request for the '/issue' route used to post a issue;
 *
 * Response is the issue posted to the database or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const postIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.post(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET /issues/?project=""?state=""?label=?
 * @description getIssue is a get request for the '/issue' route used to get a issue by it's id.
 *
 * Response are the issues fetched from the database or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getIssues = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.get(req.originalUrl);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method PUT /issue
 * @description putUpdateIssue is a put request for the '/issue' route used to update a issue;
 *
 * Response is the issue updated to the database or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const putUpdateIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const serviceResponse = await adapter.put(req.path, req.body);
    await respond(serviceResponse, req, res);
    return;
  } catch (err) {
    next(err);
  }
};
