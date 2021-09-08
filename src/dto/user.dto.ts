export interface UserBody {
    readonly email: string;
    readonly password?: string | number;
    readonly id?: number;
    readonly first_name?: string;
    readonly last_name?: string;
    readonly age?: number;
    readonly acessToken?: string;
    readonly refreshToken?: string;
}

