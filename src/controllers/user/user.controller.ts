import { Controller, Post, Req, Res, Next, Get, Body, UseGuards } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as chalk from 'chalk';

import { UserService }  from '../../services/user.service'
import { Utils } from '../../utils/index';
import { UserBody } from '../../dto/user.dto';
import { AuthMiddleware } from '../../middlewares/auth.middleware';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post('/signUp')
    async register(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
      try {
          const {
            first_name, last_name, email, age, password,
          } = req.body;

          const userEmail = email.toLowerCase();
          if (!Utils.isEmail(userEmail)) {
            res.status(400).json('Invalid email');
            return;
          }

          const user = await this.userService.findOne(userEmail, 'email');
          if (user) {
            res.status(400).json(`User with email: ${email} already exists`);
            return;
          }

          const id = await this.userService.insert({
            first_name, last_name, email: userEmail, age, password,
          });
    
          res.status(201).json(id);
        } catch (err) {
          console.error(chalk.red(err));
          next(err);
        }
    }

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
  
        delete user.password;
        res.status(200).json({ user });
      } catch (err) {
        console.error(chalk.red(err));
        next(err);
      }
    }

    @Post('/getUserByAuth')
    async checkAuth(@Body() data: UserBody, @Res() res: Response, @Next() next: NextFunction){
      try{
        const { email, password } = data;
        const userEmail = email.toLowerCase();
        if (!Utils.isEmail(userEmail)) {
          res.status(400).json('Invalid email');
          return;
        }

        const user = await this.userService.findOne(userEmail, 'email');
        
        if (!user || password !== user.password) {
          res.status(400).json('Invalid credentials');
          return;
        }

        delete user.password;
        delete user.token;
        res.json(user);
      } catch (err) {
        console.error(chalk.red(err));
        next(err);
      }
    }

    @Post('updateToken')
    async updateUser(@Body() data: any, @Res() res: Response, @Next() next: NextFunction) {
      try {
        const { id, prop, refreshToken } = data;
        const result = await this.userService.updateValue(id, prop, refreshToken);
        res.json(result);
      } catch (err) {
        console.error(chalk.red(err));
        next(err);
      }
    }
}
