import {
    Controller,
    Get,
    Query,
    Param,
    Post,
    Body,
    Patch,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserQueryDto } from './dto/user.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { UserEditDto } from './dto/user-edit.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { RequireRoles } from '../../decorators/roles.decorator';
import { ROLES } from '../../helpers/constants';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Получение списка всех пользователей' })
    @RequireRoles(ROLES.Admin)
    @Get()
    getAllUsers(@Query() query: UserQueryDto) {
        return this.usersService.getAllUsers(query);
    }

    @ApiOperation({
        summary: 'Создание пользователя',
        description: `
            Значения для role:
            - admin
            - operator
            - trader
            - merchant

            Значения для permissions:
            - cards - Мои карты;
            - cashboxes - Кассы;
            - purchases - Выплаты, Покупки;
            - transactions - Платежи, Продажа;
            - users - Пользователи;
            - statistics - Статистика;
            - balance - Баланс;
            - settings - Настройки;
        `,
    })
    @RequireRoles(ROLES.Admin)
    @Post('create/')
    createUser(@Body() userDto: UserCreateDto): Promise<User> {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Редактирование пользователя' })
    @RequireRoles(ROLES.Admin)
    @Patch('edit/')
    editUser(@Body() userDto: UserEditDto): Promise<User> {
        return this.usersService.editUser(userDto);
    }

    @ApiOperation({ summary: 'Удаление пользователя' })
    @RequireRoles(ROLES.Admin)
    @Delete('delete/:id')
    deleteUser(@Param('id') id: number): Promise<void> {
        return this.usersService.deleteUser(id);
    }
}