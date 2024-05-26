import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessToken } from './types/auth.type';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(params: SignInDto): Promise<AccessToken> {
        const user = await this.usersService.getUserByLogin(params.login);

        if (user?.password !== params.password) {
            throw new UnauthorizedException();
        }

        const payload = {
            sub: user.userId,
            userId: user.userId,
            name: user.name,
            login: user.login,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }

    async getTransactionsFlag(userId: number): Promise<boolean> {
        const user = await this.usersService.getUser(userId);
        return user.isWorkTransactions;
    }

    async switchTransactionsFlag(userId: number): Promise<boolean> {
        const user = await this.usersService.getUser(userId);
        const isWorkTransactions = !user.isWorkTransactions;
        await this.usersService.switchTransactionsFlag(userId, isWorkTransactions);
        return isWorkTransactions;
    }
}