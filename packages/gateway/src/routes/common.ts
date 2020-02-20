import { AxiosResponse } from 'axios';
import * as HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';

/**
 * @description respond is a generic function which is used in 80% of the gateway routes.
 * As for now this gateway is nothing but a big router with auth middleware, because most
 * of the reponses are the same that are being fetched from the services or the same error the service returns.
 * This is written as a helper function.
 * @param {AxiosResponse} serviceResponse
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
const respond = async (serviceResponse: AxiosResponse, req: Request, res: Response): Promise<void> => {
  if (serviceResponse.data.error != null) {
    res.status(serviceResponse.status).json({ error: serviceResponse.data.error });
    return;
  }
  res.status(HttpStatus.OK).json(serviceResponse.data);
};

export default respond;
