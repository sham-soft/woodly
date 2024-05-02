import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from '../users/users.service';
import { AccessToken } from './types/auth.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(params: SignInDto): Promise<AccessToken> {
        const user = await this.usersService.getUser(params.username);

        if (user?.password !== params.password) {
          throw new UnauthorizedException();
        }

        const payload = {
            sub: user.userId,
            username: user.name,
            roles: user.roles,
        };

        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }
}