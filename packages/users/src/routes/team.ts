import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as teamService from '../services/team';
import { TeamDocument } from '../models/Team';

/**
 * @method GET /team/?teamName=""
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
    if (req.query.teamName === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No team name given.' });
      return;
    }
    const team = await teamService.getTeam(req.query.teamName);
    if (team == null) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Team not found.' });
      return;
    }
    res.status(HttpStatus.OK).json(team);
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
    if (req.body.teamName === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No team name given.' });
      return;
    }
    if (req.body.leader === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No leader username given. The team must have a leader.' });
      return;
    }
    const usernames = req.body.usernames || [];
    const team = await teamService.createTeam(req.body.teamName, req.body.leader, usernames);
    if (team == null) {
      res.status(HttpStatus.CONFLICT).json({ error: 'Team already exists.' });
      return;
    }
    res.status(HttpStatus.OK).json(team);
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
    if (req.body.teamName === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'No team name given.' });
      return;
    }
    let team: TeamDocument | null;
    if (req.body.newName !== undefined) {
      team = await teamService.updateTeam(req.body, req.body.newName);
    } else {
      team = await teamService.updateTeam(req.body);
    }
    if (team == null) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'Team not found.' });
      return;
    }
    res.status(HttpStatus.OK).json(team);
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
    if (req.body.teamName === undefined) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: 'Team name not provided.', deleted: false });
      return;
    }
    const deleted: boolean = await teamService.deleteTeam(req.body.teamName);
    if (!deleted) {
      res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found', deleted: false });
      return;
    }
    res.status(HttpStatus.OK).json({ deleted: true });
    return;
  } catch (err) {
    next(err);
  }
};
