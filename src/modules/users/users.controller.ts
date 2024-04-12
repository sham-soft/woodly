import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserQueryDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getUsers(@Query() query: UserQueryDto) {
        return this.usersService.getUsers(query);
    }
}