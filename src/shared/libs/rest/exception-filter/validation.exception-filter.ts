import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Component } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/error.js';
import { AppError } from '../types/error.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`, error);

    error.details.forEach(
      (errorField) => this.logger.debug(`[${errorField.property}] — ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(AppError.ValidationError, error.message, error.details));
  }
}
