import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'users', schema: UserSchema, collection: 'users' },
  ])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}