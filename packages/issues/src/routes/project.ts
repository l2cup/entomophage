import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import { projectService } from '../services';

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
    if (req.query.name === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No project name provided.' });
      return;
    }
    const project = await projectService.getProject(req.query.name as string);
    if (project == null) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Project not found.' });
      return;
    }
    res.status(HttpStatus.OK).json(project);
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
export const postCreateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body.name === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No project name given' });
      return;
    }
    if (req.body.author === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No project author given.' });
      return;
    }
    const project = await projectService.createProject(req.body.name, req.body.author);
    if (project == null) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'There was an error creating the project.' });
      return;
    }
    res.status(HttpStatus.OK).json(project);
    return;
  } catch (err) {
    next(err);
  }
};

/**
 * @method PUT /project
 * @description putUpdateProject is a put request for the '/project' route used to update a project.
 *
 * Response is the updated project or an error with description.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const putUpdateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body.name === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No project name provided.' });
      return;
    }
    const project = await projectService.updateProject(req.body);
    if (project == null) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'There was an error updating the project.' });
      return;
    }
    res.status(HttpStatus.OK).json(project);
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
    if (req.body.name === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No project name provided.' });
      return;
    }
    const deleted: boolean = await projectService.deleteProject(req.body.name);
    res.status(HttpStatus.OK).json(deleted);
    return;
  } catch (err) {
    next(err);
  }
};
