import { HttpStatus } from '../http-status'

export type ErrorPayload = string | Record<string, unknown>

export class AppError extends Error {
  public readonly statusCode: HttpStatus
  public readonly payload: ErrorPayload

  constructor(payload: ErrorPayload, statusCode: HttpStatus) {
    const message = typeof payload === 'string' ? payload : JSON.stringify(payload)
    super(message)
    this.statusCode = statusCode
    this.payload = payload
    Error.captureStackTrace(this, this.constructor)
  }
}

// forma de usar:
// throw new AppError(
//   'Email is required',
//   HttpStatus.BAD_REQUEST
// );
