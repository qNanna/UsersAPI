import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user/user.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users/', method: RequestMethod.GET });
  }
}