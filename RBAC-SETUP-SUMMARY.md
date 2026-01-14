# RBAC System - Complete Setup Summary

## What Has Been Built

I've created a complete Role-Based Access Control (RBAC) system for your NestJS application with the following structure:

### 📁 File Structure

```
src/
├── rbac/
│   ├── decorators/
│   │   ├── require-permission.decorator.ts  # Permission-based protection
│   │   └── roles.decorator.ts               # Role-based protection
│   ├── dto/
│   │   ├── create-role.dto.ts               # DTO for creating roles
│   │   ├── update-role.dto.ts               # DTO for updating roles
│   │   ├── permission-structure.dto.ts      # Permission structure validation
│   │   └── resource-permission.dto.ts       # Resource permission validation
│   ├── entities/
│   │   └── permission.entity.ts             # Permission entity
│   ├── examples/
│   │   ├── api-requests.http                # API request examples
│   │   └── property-controller-with-rbac.example.ts  # Usage examples
│   ├── guards/
│   │   ├── rbac.guard.ts                    # Permission checking guard
│   │   └── roles.guard.ts                   # Role checking guard
│   ├── seeds/
│   │   ├── seed-roles.ts                    # Role seeding logic
│   │   └── run-seed.ts                      # Seed runner script
│   ├── rbac.controller.ts                   # RBAC management endpoints
│   ├── rbac.module.ts                       # RBAC module definition
│   ├── rbac.service.ts                      # RBAC business logic
│   └── RBAC-USAGE-GUIDE.md                  # Complete usage guide
│
├── entities/
│   └── role.entity.ts                       # Updated with permissions relation
│
└── app.module.ts                            # Updated with RbacModule
```

## Database Schema

### Tables Created
1. **Roles** - Stores role definitions (super_admin, user)
2. **Permissions** - Stores permission structures for each role
3. **Users_roles_Roles** - Junction table linking users to roles

## Features Implemented

### 1. Two Access Control Methods

**Role-Based Access** (`@Roles` decorator):
- Simple role checking
- Example: `@Roles('super_admin', 'user')`

**Permission-Based Access** (`@RequirePermission` decorator):
- Fine-grained resource and action control
- Example: `@RequirePermission({ resource: 'properties', action: 'add' })`

### 2. Permission Structure

Each role has permissions for resources with four actions:
- **add**: Create new resources
- **view**: Read/view resources
- **edit**: Update existing resources
- **delete**: Delete resources

**Supported Resources**:
- `campaign`
- `properties`

### 3. Default Roles

**super_admin**:
```json
{
  "campaign": { "add": true, "view": true, "edit": true, "delete": true },
  "properties": { "add": true, "view": true, "edit": true, "delete": true }
}
```

**user**:
```json
{
  "campaign": { "add": false, "view": true, "edit": true, "delete": true },
  "properties": { "add": true, "view": true, "edit": false, "delete": false }
}
```

## Setup Steps

### Step 1: Generate and Run Migration

```bash
# Generate migration for new tables
npm run migration:generate

# Run the migration
npm run migration:run
```

### Step 2: Seed Initial Roles

```bash
# Run the seed script to create default roles
npm run seed:roles
```

### Step 3: Assign Roles to Users

You have two options:

**Option A: Via SQL**
```sql
-- Assign super_admin role to user with id 1
INSERT INTO dbo.Users_roles_Roles (usersId, rolesId)
VALUES (1, (SELECT Id FROM dbo.Roles WHERE Name = 'super_admin'));
```

**Option B: Via API** (requires updating register/user creation logic)
```typescript
// In your register service
const role = await this.roleRepository.findOne({ where: { Name: 'user' } });
user.roles = [role];
await this.userRepository.save(user);
```

## API Endpoints

All RBAC management endpoints require authentication and super_admin role:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rbac/roles` | Create a new role |
| GET | `/rbac/roles` | Get all roles |
| GET | `/rbac/roles/:id` | Get role by ID |
| PATCH | `/rbac/roles/:id` | Update a role |
| DELETE | `/rbac/roles/:id` | Delete a role |
| GET | `/rbac/my-permissions` | Get current user's permissions |

## Usage in Controllers

### Basic Protection (Role-Based)

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertyController {
  @Get()
  @Roles('super_admin', 'user')
  findAll() {
    // Only super_admin and user roles can access
  }
}
```

### Advanced Protection (Permission-Based)

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { RequirePermission } from '../rbac/decorators/require-permission.decorator';

@Controller('properties')
@UseGuards(JwtAuthGuard, RbacGuard)
export class PropertyController {
  @Post()
  @RequirePermission({ resource: 'properties', action: 'add' })
  create() {
    // Only users with 'add' permission on 'properties' can access
  }
}
```

## Example: Updating Property Controller

To protect your existing property routes:

```typescript
// Before (no RBAC)
@Post()
@UseGuards(JwtAuthGuard)
create(@Body() dto: CreatePropertyDto) { }

// After (with RBAC)
@Post()
@UseGuards(JwtAuthGuard, RbacGuard)
@RequirePermission({ resource: 'properties', action: 'add' })
create(@Body() dto: CreatePropertyDto) { }
```

## Testing the System

### 1. Create Roles
```bash
POST /rbac/roles
Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN
Content-Type: application/json

{
  "role": "user",
  "permission": [...]
}
```

### 2. Check Your Permissions
```bash
GET /rbac/my-permissions
Authorization: Bearer YOUR_TOKEN
```

### 3. Test Access Control
```bash
# Should succeed if you have 'add' permission
POST /properties
Authorization: Bearer YOUR_TOKEN

# Should fail if you don't have 'delete' permission
DELETE /properties/1
Authorization: Bearer YOUR_TOKEN
```

## Integration with Existing Modules

To use RBAC in any module:

```typescript
import { Module } from '@nestjs/common';
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [RbacModule],
  // ... your controllers and providers
})
export class YourModule {}
```

**Already integrated in**:
- ✅ PropertyModule
- ✅ AppModule

**To integrate in**:
- CampaignModule (recommended)
- LeadModule (if needed)

## Updated Files

### Modified Existing Files:
1. [src/entities/role.entity.ts](src/entities/role.entity.ts) - Added permissions relationship
2. [src/users/users.service.ts](src/users/users.service.ts) - Added role loading
3. [src/auth/jwt.strategy.ts](src/auth/jwt.strategy.ts) - Added roles to JWT payload
4. [src/app.module.ts](src/app.module.ts) - Added RbacModule
5. [src/property/property.module.ts](src/property/property.module.ts) - Added RbacModule
6. [package.json](package.json) - Added seed:roles script

### Created New Files:
- Complete RBAC module with 20+ files
- Usage guide and examples
- Seed scripts for easy setup

## Next Steps

### 1. Run Database Setup
```bash
npm run migration:generate
npm run migration:run
npm run seed:roles
```

### 2. Assign Roles to Users
Use SQL or API to assign roles to existing users.

### 3. Protect Your Routes
Add `@RequirePermission()` or `@Roles()` decorators to your controllers:
- [src/property/property.controller.ts](src/property/property.controller.ts)
- [src/campaign/campaign.controller.ts](src/campaign/campaign.controller.ts)

### 4. Test the System
Use the [API examples](src/rbac/examples/api-requests.http) to test access control.

### 5. Add New Resources (Optional)
If you need to add more resources beyond 'campaign' and 'properties', follow the guide in [RBAC-USAGE-GUIDE.md](src/rbac/RBAC-USAGE-GUIDE.md#adding-new-resources).

## Common Issues & Solutions

### Issue: "User does not have required role"
**Solution**: Ensure the user has been assigned the correct role in the database.

### Issue: "User does not have permission"
**Solution**: Check the role's permission structure. The user must have the specific action permission for the resource.

### Issue: Migration fails
**Solution**: Check if tables already exist. Use `npm run migration:show` to see migration status.

### Issue: Seed fails with "Roles already exist"
**Solution**: This is normal. The seed script checks and skips if roles exist. To re-seed, delete existing roles first.

## Documentation

For complete documentation, see:
- [RBAC Usage Guide](src/rbac/RBAC-USAGE-GUIDE.md) - Detailed usage instructions
- [API Examples](src/rbac/examples/api-requests.http) - HTTP request examples
- [Controller Example](src/rbac/examples/property-controller-with-rbac.example.ts) - Integration examples

## Support

If you encounter issues:
1. Check the error message and refer to the usage guide
2. Verify your JWT token is valid
3. Ensure the user has the correct role/permissions
4. Check that guards are applied in the correct order: `JwtAuthGuard` first, then RBAC guards

---

**Your RBAC system is ready to use!** 🎉
