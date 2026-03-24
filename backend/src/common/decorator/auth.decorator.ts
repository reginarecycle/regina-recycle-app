import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/role.guard';


export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export function Auth(...roles: string[]) {
  const decorators = [
    UseGuards(JwtAuthGuard),
    ApiBearerAuth('JWT-auth'),
  ];

  if (roles.length > 0) {
    decorators.push(
      SetMetadata(ROLES_KEY, roles),
      UseGuards(RolesGuard),
    );
  }

  return applyDecorators(...decorators);
}