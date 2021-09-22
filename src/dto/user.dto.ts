import { Allow, IsDefined } from 'class-validator'

export class UserBody {
    @Allow() @IsDefined()
    readonly email: string;
    @Allow() @IsDefined()
    readonly password: number | string;
    @Allow() @IsDefined()
    readonly first_name: string;
    @Allow() @IsDefined()
    readonly last_name: string;
    @Allow() @IsDefined()
    readonly age: number;
    @Allow() 
    readonly id?: number;
    @Allow() 
    readonly acessToken?: string;
    @Allow() 
    readonly refreshToken?: string;
}
