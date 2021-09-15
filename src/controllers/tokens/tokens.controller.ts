import { Controller, Get, Patch, Body, Query, Res, Next } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as chalk from 'chalk';

import { TokenService } from 'src/services/token.service';
import { Utils } from 'src/utils';
import config from 'src/config';

@Controller('api/v1/tokens')
export class TokensController {
    constructor(private readonly tokenService: TokenService, private readonly utils: Utils) {}
    @Get('userId')
    async getTokenById(@Query('id') id: string, @Res() res: Response, @Next() next: NextFunction) {
        if (!id) {
            res.status(400).json('No email provided!');
            return;
        }
        try {
            const token = await this.tokenService.findToken(id, 'userId')
            res.json(token)
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
        
        const jwt = this.utils.jwtVerify(refreshToken, config.jwtTokenKey)
        if (jwt.error) {
            res.status(400).json('Token was expired!');
            return;
        }
        
        const token = await this.tokenService.findToken(jwt.id, 'userId');
        if (!token) {
            const insert = await this.tokenService.insertToken({ userId: jwt.id, token: refreshToken })
            res.json(insert);
            return;
        }
        
        const result = await this.tokenService.updateToken(refreshToken, jwt.id)
        res.json(result)
        } catch (err) {
        console.error(chalk.red(err));
        next(err);
        }
    }
}
