import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../helpers/constants';
import type { CustomDecorator } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const RequireRoles = (...roles: ROLES[]): CustomDecorator => SetMetadata(ROLES_KEY, roles);