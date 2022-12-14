import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import config from '../config/index'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (!req.headers.authorization) {
      return res.status(403).send('A token is required');
    }
      const bearerHeader = req.headers.authorization;
      const [, token] = bearerHeader.split(' ');
      try {
        req.user = jwt.verify(token, config.jwtTokenKey);
      } catch (err) {
        return res.status(401).json('Invalid Token');
      }
    next();
  }
}
