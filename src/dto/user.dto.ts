import { Allow } from 'class-validator'

export class UserBody {
    @Allow()
    readonly email: string;
    @Allow()
    readonly password: number | string;
    @Allow()
    readonly id?: number;
    @Allow()
    readonly first_name: string;
    @Allow()
    readonly last_name: string;
    @Allow()
    readonly age: number;
    @Allow()
    readonly acessToken?: string;
    @Allow()
    readonly refreshToken?: string;
}
