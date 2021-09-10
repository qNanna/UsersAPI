import { Controller, Post, Res, Next, Get, Body, UsePipes, ValidationPipe, Patch, Query, Param } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as chalk from 'chalk';

import { UserService }  from 'src/services/user.service'
import config from 'src/config';
import { Utils as utils } from 'src/utils/index';
import { UserBody } from 'src/dto/user.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('email')
  async getUserByEmail(@Query('email') email: string, @Res() res: Response, @Next() next: NextFunction) {
    if (!email) {
      res.status(400).json('No email provided!');
      return;
    }

    try {
      const user = await this.userService.findOne(email.toLowerCase(), 'email');
      if (!user) {
        res.status(404).json('User not found');
        return;
      }

      const { token } = await this.userService.findToken(user.id, 'userId')
      res.json({ ...user, token })
    } catch (err) {
      console.error(chalk.red(err));
      next(err);
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const user = await this.userService.findOne(id, 'id');
      if (!user) {
        res.status(400).json(`User with id: ${id} not found`);
        return;
      }
      
      const { token } = await this.userService.findToken(user.id, 'userId')
      res.json({ ...user, token });
    } catch (err) {
      console.error(chalk.red(err));
      next(err);
    }
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('/create')
  async createUser(@Body() userDto: UserBody, @Res() res: Response, @Next() next: NextFunction){
    try {
      if(!userDto) {
        res.sendStatus(400).json('User data is required!');
        return;
      }

      const userEmail = userDto.email.toLowerCase();
      if (!utils.isEmail(userEmail)) {
        res.status(400).json('Invalid email');
        return;
      }

      const user = await this.userService.findOne(userEmail, 'email');
      if (user) {
        res.status(400).json(`User with email: ${userDto.email} already exists`);
        return;
      }

      const password = utils.encryptData(userDto.password.toString(), config.cryptoSecretKey);
      const id = await this.userService.insert({ ...userDto, password, email: userEmail }, 'users');

      res.json(id)
    } catch (err) {
      console.error(chalk.red(err));
      next(err);
    }
  }

  @Patch()
  async updateToken(@Body('refreshToken') refreshToken: string, @Res() res: Response, @Next() next: NextFunction){
    try {
      if(!refreshToken) {
        res.status(400).json('A token is required!');
        return;
      }
      
      const jwt = utils.jwtVerify(refreshToken, config.jwtTokenKey)
      if (jwt.error) {
        res.status(400).json('Token was expired!');
        return;
      }
      
      const token = await this.userService.findToken(jwt.id, 'userId');
      if (!token) {
        const insert = await this.userService.insertToken({ userId: jwt.id, token: refreshToken })
        res.json(insert);
        return;
      }
      
      const result = await this.userService.updateToken(refreshToken, jwt.id)
      res.json(result)
    } catch (err) {
      console.error(chalk.red(err));
      next(err);
    }
  }

}
