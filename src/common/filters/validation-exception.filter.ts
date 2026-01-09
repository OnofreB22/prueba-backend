import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    const errors = exceptionResponse.message || [];

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      error: 'Validation Error',
      message: 'Los datos proporcionados no son válidos',
      validationErrors: Array.isArray(errors) ? errors : [errors],
    });
  }
}
