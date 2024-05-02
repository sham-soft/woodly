import {
    Controller,
    Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { RolesCheck } from '../../decorators/roles.decorator';
import { ROLES } from '../../helpers/constants';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Получение списка всех пользователей' })
    @RolesCheck(ROLES.Admin)
    @Get()
    getAllUsers(): Promise<User[]> {
        return this.usersService.getAllUsers();
    }
}