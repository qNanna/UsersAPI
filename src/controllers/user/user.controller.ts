import { Controller, Post, Res, Next, Get, Body, UsePipes, ValidationPipe, Query, Param } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as chalk from 'chalk';

import { UserService }  from 'src/services/user.service';
import config from 'src/config';
import { Utils } from 'src/utils/index';
import { UserBody } from 'src/dto/user.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly utils: Utils) {}
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

      res.json({ ...user })
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
        res.status(404).json(`User with id: ${id} not found`);
        return;
      }
      
      res.json({ ...user });
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
      if (!this.utils.isEmail(userEmail)) {
        res.status(400).json('Invalid email');
        return;
      }

      const user = await this.userService.findOne(userEmail, 'email');
      if (user) {
        res.status(400).json(`User with email: ${userDto.email} already exists`);
        return;
      }

      const password = this.utils.encryptData(userDto.password.toString(), config.cryptoSecretKey);
      await this.userService.insert({ ...userDto, password, email: userEmail }, 'users');

      res.status(201).json('Created');
    } catch (err) {
      console.error(chalk.red(err));
      next(err);
    }
  }

}
