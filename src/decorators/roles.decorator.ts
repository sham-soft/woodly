import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../helpers/constants';

export const ROLES_KEY = 'roles';

export const RequireRoles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles);