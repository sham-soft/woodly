import { Request } from 'express';
import { User } from '../modules/users/schemas/user.schema';

export interface CustomRequest extends Request {
    user: User;
}