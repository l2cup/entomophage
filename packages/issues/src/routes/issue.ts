import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import { issueService } from '../services';

/**
 * @method GET /issue/?id=""
 * @description getIssue is a get request for the '/issue' route used to get a issue by it's id.
 *
 * Response is the project fetched from the database or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getIssue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.query.id === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json('No id provided');
      return;
    }
    const issue = await issueService.getIssue(req.query.id);
    if (issue === undefined) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Issue not found' });
      return;
    }
    res.status(HttpStatus.OK).json(issue);
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
    if (req.query.project === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Project not provided.' });
      return;
    }
    const issues = await issueService.getIssues(req.query.project, req.query.state, req.query.label);
    if (issues.length === 0) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'No issues found.' });
      return;
    }
    res.status(HttpStatus.OK).json(issues);
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
    if (req.body.project === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Project not provided.' });
      return;
    }
    if (req.body.label === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Label not provided.' });
      return;
    }
    if (req.body.state === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'State not provided.' });
      return;
    }
    if (req.body.name === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Name not provided.' });
      return;
    }
    if (req.body.issuedBy === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'isuedBy not provided.' });
      return;
    }
    const issue = await issueService.createIssue(req.body);
    if (issue == null) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Could not create issue.' });
    }
    res.status(HttpStatus.OK).json(issue);
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
    if (req.body.id === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No id provided.' });
      return;
    }
    const issue = await issueService.updateIssue(req.body);
    if (issue == null) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Issue not found.' });
      return;
    }
    res.status(HttpStatus.OK).json(issue);
    return;
  } catch (err) {
    next(err);
  }
};
