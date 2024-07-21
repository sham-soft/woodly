import { ApiTags, ApiOperation } from '@nestjs/swagger';
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
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UserQueryDto } from './dto/user.dto';
import { UserEditDto } from './dto/user-edit.dto';
import { UserEditTariffDto } from './dto/user-edit-tariff.dto';
import { UserCreateDto } from './dto/user-create.dto';
import { ROLES } from '../../helpers/constants';
import { RequireRoles } from '../../decorators/roles.decorator';
import type { PaginatedList } from '../../types/paginated-list.type';

@ApiTags('Users')
@RequireRoles(ROLES.Admin)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Получение списка всех пользователей' })
    @Get()
    getAllUsers(@Query() query: UserQueryDto): Promise<PaginatedList<User>> {
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
    @Post('create/')
    createUser(@Body() userDto: UserCreateDto): Promise<User> {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Редактирование пользователя' })
    @Patch('edit/')
    editUser(@Body() userDto: UserEditDto): Promise<User> {
        return this.usersService.editUser(userDto);
    }

    @ApiOperation({ summary: 'Удаление пользователя' })
    @Delete('delete/:id')
    deleteUser(@Param('id') id: number): Promise<void> {
        return this.usersService.deleteUser(id);
    }

    @ApiOperation({ summary: 'Редактирование тарифа пользователя' })
    @Patch('edit-tariff/')
    editTariff(@Body() tariffDto: UserEditTariffDto): Promise<User> {
        return this.usersService.editTariff(tariffDto);
    }
}