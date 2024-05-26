import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Request,
} from '@nestjs/common';
import { AccessToken } from './types/auth.type';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import type { CustomRequest } from '../../types/custom-request.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'Авторизация',
        description: `
            - Аккаунт админа - [roma, 123]
            - Аккаунт оператора - [sham, 123]
            - Аккаунт трейдера - [dima, 123]
            - Аккаунт мерчанта - [sasha, 123]
        `,
    })
    @Public()
    @Post()
    signIn(@Body() signInDto: SignInDto): Promise<AccessToken> {
        return this.authService.signIn(signInDto);
    }

    @ApiOperation({ summary: 'Получение данных профиля' })
    @Get('profile')
    getUser(@Request() req: CustomRequest): CustomRequest['user'] {
        return req.user;
    }

    @ApiOperation({ summary: 'Получение статуса фалга сделки' })
    @RequireRoles(ROLES.Trader)
    @Get('transactions-flag')
    getTransactionsFlag(@Request() req: CustomRequest): Promise<boolean> {
        return this.authService.getTransactionsFlag(req.user.userId);
    }

    @ApiOperation({ summary: 'Включение/Отключение флага сделки' })
    @RequireRoles(ROLES.Trader)
    @Patch('switch-transactions-flag')
    switchTransactionsFlag(@Request() req: CustomRequest): Promise<boolean> {
        return this.authService.switchTransactionsFlag(req.user.userId);
    }
}