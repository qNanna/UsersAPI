import { Controller, Post, Req, Res, Next, Get, Body, UsePipes, ValidationPipe, Patch } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as chalk from 'chalk';

import { UserService }  from 'src/services/user.service'
import config from 'src/config';
import { Utils as utils } from 'src/utils/index';
import { UserBody } from 'src/dto/user.dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getUser(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const id = req.query.id || !req.params.id || req.body.id;
      if (!id) {
        res.status(400).json('A id is requested');
        return;
      }

      const user = await this.userService.findOne(id, 'id');
      if (!user) {
        res.status(400).json(`User with id: ${id} not found`);
        return;
      }

      // delete user.password;
      // delete user.token;
      res.json({ user });
    } catch (err) {
      console.error(chalk.red(err));
      next(err);
    }
  }

  @Post('/byCredentials')
  async getUserByCredentials(@Body() userDto: UserBody, @Res() res: Response, @Next() next: NextFunction) {
    try {
      if (!userDto.email && !userDto.password) {
        res.status(400).json('Invalid credentials!');
        return;
      }
      const user = await this.userService.findOne(userDto.email.toLowerCase(), 'email');
      if (!user || userDto.password !== user.password) {
        res.status(400).json('Invalid credentials');
        return;
      }

      delete user.token;

      res.json(user)
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
      const id = await this.userService.insert({ ...userDto, password, email: userEmail });

      res.json(id)
    } catch (err) {
      console.error(chalk.red(err));
      next(err);
    }
  }

  @Patch()
  async updateToken(@Body() body: any, @Res() res: Response, @Next() next: NextFunction){
    try {
      if(!body.refreshToken) {
        res.status(400).json('A token is required!');
        return;
      }

      const token = utils.jwtVerify(body.refreshToken, config.jwtTokenKey)
      if (token.error) {
        res.status(400).json(token);
        return;
      }
      
      const result = await this.userService.updateValue(token.id, 'token', body.refreshToken)

      res.json(`Updated: ${result}`)
    } catch (err) {
      console.error(chalk.red(err));
      next(err);
    }
  }

}
