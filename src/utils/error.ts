import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.TOO_MANY_REQUESTS);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export class ZodValidationError extends Error {
  public fieldErros: any;
  public statusCode = StatusCodes.BAD_REQUEST;
  constructor(
    public message: string,
    error: ZodError,
  ) {
    super(message);
    this.message = message;
    if (error instanceof ZodError) {
      this.fieldErros = error.flatten().fieldErrors;
    }
  }
}
