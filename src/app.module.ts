import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user/user.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { TokensController } from './controllers/tokens/tokens.controller';
import { TokenService } from './services/token.service';
import { Utils } from './utils';

@Module({
  imports: [],
  controllers: [UserController, TokensController],
  providers: [UserService, TokenService, Utils],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'api/v1/users/1', method: RequestMethod.GET });
  }
}