import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserQueryDto } from './dto/user.dto';

@ApiTags('Users (Пока недоступен)')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getUsers(@Query() query: UserQueryDto) {
        return this.usersService.getUsers(query);
    }
}