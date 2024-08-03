import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessToken } from './types/auth.type';
import { SignInDto } from './dto/sign-in.dto';
import { ProfileEditDto } from './dto/profile-edit.dto';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import type { CustomRequest } from '../../types/custom-request.type';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly sessionsService: SessionsService,
    ) {}

    async signIn(params: SignInDto, req: CustomRequest): Promise<AccessToken> {
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

        const accessToken = await this.jwtService.signAsync(payload);

        const ip = 
            req.headers['cf-connecting-ip'] ||  
            req.headers['x-real-ip'] ||
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress || '';

        const newSession = {
            ip: ip as string,
            token: accessToken,
            creatorId: user.userId,
        };

        await this.sessionsService.createSession(newSession);

        return {
            accessToken,
        };
    }

    async editProfile(params: ProfileEditDto, req: CustomRequest): Promise<AccessToken> {
        const payload = {
            userId: req.user.userId,
            ...params,
        };
        const user = await this.usersService.editUser(payload);

        const newAccessToken = await this.signIn({ login: user.login, password: user.password }, req);
        await this.sessionsService.deleteAllSessions(req.user.userId, newAccessToken.accessToken);

        return newAccessToken;
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