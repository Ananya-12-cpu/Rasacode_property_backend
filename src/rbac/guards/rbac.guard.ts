import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacService } from '../rbac.service';
import {
  PERMISSION_KEY,
  PermissionRequirement,
} from '../decorators/require-permission.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check for permission requirement
    const permissionRequirement =
      this.reflector.getAllAndOverride<PermissionRequirement>(PERMISSION_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // Check for role requirement
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permission or role requirement, allow access
    if (!permissionRequirement && !requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check role-based access
    if (requiredRoles) {
      const userRoles = user.roles?.map((role: any) => role.Name) || [];
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        throw new ForbiddenException(
          `User does not have required role. Required: ${requiredRoles.join(', ')}`,
        );
      }
    }

    // Check permission-based access
    if (permissionRequirement) {
      const hasPermission = await this.rbacService.checkPermission(
        user.id,
        permissionRequirement.resource,
        permissionRequirement.action,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `User does not have permission to ${permissionRequirement.action} ${permissionRequirement.resource}`,
        );
      }
    }

    return true;
  }
}
