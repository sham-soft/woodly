import {
    Controller,
    Get,
    Post,
    Body,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';
import { AccessToken } from './types/auth.type';
import { Public } from '../../decorators/public.decorator';

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
    getUser(@Request() req: any): Promise<User> {
        return req.user;
    }
}