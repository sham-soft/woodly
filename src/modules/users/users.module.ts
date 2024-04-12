import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'users', schema: UserSchema, collection: 'users' },
  ])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}