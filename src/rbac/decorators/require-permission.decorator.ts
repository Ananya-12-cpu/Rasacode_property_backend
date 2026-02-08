import { SetMetadata } from '@nestjs/common';

export interface PermissionRequirement {
  resource: 'campaign' | 'properties' | 'user_management';
  action: 'add' | 'view' | 'edit' | 'delete';
}

export const PERMISSION_KEY = 'permission';
export const RequirePermission = (requirement: PermissionRequirement) =>
  SetMetadata(PERMISSION_KEY, requirement);
