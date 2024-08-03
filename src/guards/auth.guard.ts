import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { SessionsService } from '../modules/sessions/sessions.service';
import { jwtConstants } from '../helpers/constants';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
  
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private readonly sessionsService: SessionsService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Проверка на публичный доступ
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // Проверка токена
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                { secret: jwtConstants.secret }
            );

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        const session = await this.sessionsService.getSession(token);

        if (!session) {
            throw new UnauthorizedException();
        }

        return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}