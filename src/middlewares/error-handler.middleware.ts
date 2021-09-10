import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction, Application} from 'express';


@Injectable()
export class ErrorHanderMiddleware {
  constructor(private readonly app: Application) {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next();
      }
      return res.status(err.status || 500).send({
        error: {
          message: err.message,
        },
      });
    })
  }
}

class Error {
  private message: string;
  private status: number

  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
}