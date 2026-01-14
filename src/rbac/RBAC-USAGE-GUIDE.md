# RBAC (Role-Based Access Control) Usage Guide

## Overview

This RBAC system provides fine-grained permission control for your NestJS application. It supports two levels of access control:
- **Role-based**: Simple role checking (e.g., super_admin, user)
- **Permission-based**: Granular resource and action permissions (e.g., add/view/edit/delete for campaigns and properties)

## Database Schema

### Tables Created
1. **Roles** - Stores role definitions
2. **Permissions** - Stores permission structures for each role
3. **Users_roles_Roles** - Junction table linking users to roles

## API Endpoints

### 1. Create a Role

**POST** `/rbac/roles`

**Authorization**: Requires `super_admin` role

**Request Body**:
```json
{
  "role": "user",
  "permission": [
    {
      "campaign": {
        "add": false,
        "view": true,
        "edit": true,
        "delete": true
      },
      "properties": {
        "add": true,
        "view": true,
        "edit": false,
        "delete": false
      }
    }
  ]
}
```

**Example for super_admin**:
```json
{
  "role": "super_admin",
  "permission": [
    {
      "campaign": {
        "add": true,
        "view": true,
        "edit": true,
        "delete": true
      },
      "properties": {
        "add": true,
        "view": true,
        "edit": true,
        "delete": true
      }
    }
  ]
}
```

### 2. Get All Roles

**GET** `/rbac/roles`

**Authorization**: Requires `super_admin` role

**Response**:
```json
[
  {
    "Id": 1,
    "Name": "super_admin",
    "permissions": [
      {
        "id": 1,
        "permissions": {
          "campaign": {
            "add": true,
            "view": true,
            "edit": true,
            "delete": true
          },
          "properties": {
            "add": true,
            "view": true,
            "edit": true,
            "delete": true
          }
        }
      }
    ]
  }
]
```

### 3. Get Role by ID

**GET** `/rbac/roles/:id`

**Authorization**: Requires `super_admin` role

### 4. Update Role

**PATCH** `/rbac/roles/:id`

**Authorization**: Requires `super_admin` role

**Request Body**: Same structure as Create Role

### 5. Delete Role

**DELETE** `/rbac/roles/:id`

**Authorization**: Requires `super_admin` role

### 6. Get My Permissions

**GET** `/rbac/my-permissions`

**Authorization**: Requires valid JWT token

**Response**:
```json
[
  {
    "role": "user",
    "permissions": [
      {
        "campaign": {
          "add": false,
          "view": true,
          "edit": true,
          "delete": true
        },
        "properties": {
          "add": true,
          "view": true,
          "edit": false,
          "delete": false
        }
      }
    ]
  }
]
```

## Usage in Controllers

### Option 1: Role-Based Protection

Use `@Roles()` decorator to restrict access by role:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertyController {

  @Post()
  @Roles('super_admin', 'user')  // Both super_admin and user can create
  create(@Body() dto: CreatePropertyDto) {
    // Your logic
  }

  @Delete(':id')
  @Roles('super_admin')  // Only super_admin can delete
  remove(@Param('id') id: number) {
    // Your logic
  }
}
```

### Option 2: Permission-Based Protection

Use `@RequirePermission()` decorator for fine-grained control:

```typescript
import { Controller, Get, Post, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { RequirePermission } from '../rbac/decorators/require-permission.decorator';

@Controller('properties')
@UseGuards(JwtAuthGuard, RbacGuard)
export class PropertyController {

  @Post()
  @RequirePermission({ resource: 'properties', action: 'add' })
  create(@Body() dto: CreatePropertyDto) {
    // Only users with 'add' permission on 'properties' can access
  }

  @Get()
  @RequirePermission({ resource: 'properties', action: 'view' })
  findAll() {
    // Only users with 'view' permission on 'properties' can access
  }

  @Put(':id')
  @RequirePermission({ resource: 'properties', action: 'edit' })
  update(@Param('id') id: number, @Body() dto: UpdatePropertyDto) {
    // Only users with 'edit' permission on 'properties' can access
  }

  @Delete(':id')
  @RequirePermission({ resource: 'properties', action: 'delete' })
  remove(@Param('id') id: number) {
    // Only users with 'delete' permission on 'properties' can access
  }
}
```

### Option 3: Campaign Resource Protection

```typescript
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { RequirePermission } from '../rbac/decorators/require-permission.decorator';

@Controller('campaign')
@UseGuards(JwtAuthGuard, RbacGuard)
export class CampaignController {

  @Post()
  @RequirePermission({ resource: 'campaign', action: 'add' })
  create(@Body() dto: CreateCampaignDto) {
    // Only users with 'add' permission on 'campaign' can access
  }

  @Get()
  @RequirePermission({ resource: 'campaign', action: 'view' })
  findAll() {
    // Only users with 'view' permission on 'campaign' can access
  }

  @Put(':id')
  @RequirePermission({ resource: 'campaign', action: 'edit' })
  update(@Param('id') id: number, @Body() dto: UpdateCampaignDto) {
    // Only users with 'edit' permission on 'campaign' can access
  }

  @Delete(':id')
  @RequirePermission({ resource: 'campaign', action: 'delete' })
  remove(@Param('id') id: number) {
    // Only users with 'delete' permission on 'campaign' can access
  }
}
```

## Database Setup

### 1. Run Migration

First, generate a migration for the new entities:

```bash
npm run migration:generate
```

Then run the migration:

```bash
npm run migration:run
```

### 2. Seed Initial Roles

You can create roles via the API or directly in the database. Here's a SQL script to seed initial roles:

```sql
-- Insert super_admin role
INSERT INTO dbo.Roles (Name) VALUES ('super_admin');
INSERT INTO dbo.Roles (Name) VALUES ('user');

-- Get the role IDs
DECLARE @SuperAdminId INT = (SELECT Id FROM dbo.Roles WHERE Name = 'super_admin');
DECLARE @UserId INT = (SELECT Id FROM dbo.Roles WHERE Name = 'user');

-- Insert permissions for super_admin
INSERT INTO dbo.Permissions (roleId, permissions)
VALUES (
  @SuperAdminId,
  '{"campaign":{"add":true,"view":true,"edit":true,"delete":true},"properties":{"add":true,"view":true,"edit":true,"delete":true}}'
);

-- Insert permissions for user
INSERT INTO dbo.Permissions (roleId, permissions)
VALUES (
  @UserId,
  '{"campaign":{"add":false,"view":true,"edit":true,"delete":true},"properties":{"add":true,"view":true,"edit":false,"delete":false}}'
);
```

### 3. Assign Roles to Users

To assign a role to a user:

```sql
-- Assign super_admin role to user with id 1
INSERT INTO dbo.Users_roles_Roles (usersId, rolesId)
VALUES (1, (SELECT Id FROM dbo.Roles WHERE Name = 'super_admin'));

-- Assign user role to user with id 2
INSERT INTO dbo.Users_roles_Roles (usersId, rolesId)
VALUES (2, (SELECT Id FROM dbo.Roles WHERE Name = 'user'));
```

## Testing the RBAC System

### 1. Create Roles (as super_admin)

```bash
curl -X POST http://localhost:3000/rbac/roles \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "user",
    "permission": [{
      "campaign": {"add": false, "view": true, "edit": true, "delete": true},
      "properties": {"add": true, "view": true, "edit": false, "delete": false}
    }]
  }'
```

### 2. Check Your Permissions

```bash
curl -X GET http://localhost:3000/rbac/my-permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Test Protected Endpoints

Try accessing a protected endpoint:

```bash
# This should succeed if you have 'add' permission on 'properties'
curl -X POST http://localhost:3000/properties \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ ... property data ... }'

# This should fail if you don't have 'delete' permission on 'properties'
curl -X DELETE http://localhost:3000/properties/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Module Integration

To use RBAC in your modules, import the `RbacModule`:

```typescript
import { Module } from '@nestjs/common';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [RbacModule],
  // ... your controllers and providers
})
export class YourModule {}
```

## Adding New Resources

To add new resources (beyond 'campaign' and 'properties'):

1. Update the `PermissionStructure` interface in [permission.entity.ts](src/entities/permission.entity.ts):

```typescript
export interface PermissionStructure {
  campaign: ResourcePermission;
  properties: ResourcePermission;
  newResource: ResourcePermission;  // Add your new resource
}
```

2. Update the `PermissionStructureDto` in [permission-structure.dto.ts](src/rbac/dto/permission-structure.dto.ts):

```typescript
export class PermissionStructureDto {
  @ValidateNested()
  @Type(() => ResourcePermissionDto)
  campaign: ResourcePermissionDto;

  @ValidateNested()
  @Type(() => ResourcePermissionDto)
  properties: ResourcePermissionDto;

  @ValidateNested()
  @Type(() => ResourcePermissionDto)
  newResource: ResourcePermissionDto;  // Add your new resource
}
```

3. Use the decorator in your controller:

```typescript
@RequirePermission({ resource: 'newResource', action: 'view' })
```

## Error Responses

### 403 Forbidden - Missing Role

```json
{
  "statusCode": 403,
  "message": "User does not have required role. Required: super_admin",
  "error": "Forbidden"
}
```

### 403 Forbidden - Missing Permission

```json
{
  "statusCode": 403,
  "message": "User does not have permission to delete properties",
  "error": "Forbidden"
}
```

### 401 Unauthorized - Not Authenticated

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Best Practices

1. **Use Permission-Based Control for Operations**: For CRUD operations, use `@RequirePermission()` for fine-grained control
2. **Use Role-Based Control for Administrative Access**: For admin-only features, use `@Roles('super_admin')`
3. **Combine Both When Needed**: You can use both decorators together
4. **Always Include JWT Guard**: Always use `JwtAuthGuard` before RBAC guards
5. **Order Matters**: Guards execute in the order they're declared

Example of combining guards:
```typescript
@Controller('properties')
@UseGuards(JwtAuthGuard, RbacGuard)  // First authenticate, then authorize
export class PropertyController {
  @Post()
  @Roles('super_admin', 'user')  // Role check
  @RequirePermission({ resource: 'properties', action: 'add' })  // Permission check
  create(@Body() dto: CreatePropertyDto) {
    // User must have the role AND the permission
  }
}
```
