# RBAC Quick Start Checklist

Follow these steps to get your RBAC system up and running quickly.

## ✅ Step-by-Step Setup

### 1️⃣ Generate and Run Database Migration

```bash
# Generate migration
npm run migration:generate

# Review the generated migration file in src/migrations/

# Run the migration
npm run migration:run
```

**What this does**: Creates the `Permissions` table and updates the `Roles` table.

---

### 2️⃣ Seed Initial Roles

```bash
npm run seed:roles
```

**What this does**: Creates two default roles:
- `super_admin` - Full permissions on all resources
- `user` - Limited permissions (can add/view properties, view/edit/delete campaigns)

---

### 3️⃣ Assign Roles to Your Users

**Option A: Direct SQL**
```sql
-- Get your user ID
SELECT id, username FROM dbo.Users;

-- Assign super_admin to user with ID 1
INSERT INTO dbo.Users_roles_Roles (usersId, rolesId)
VALUES (1, (SELECT Id FROM dbo.Roles WHERE Name = 'super_admin'));

-- Assign user role to user with ID 2
INSERT INTO dbo.Users_roles_Roles (usersId, rolesId)
VALUES (2, (SELECT Id FROM dbo.Roles WHERE Name = 'user'));
```

**Option B: Update your registration logic**
```typescript
// In register.service.ts or users.service.ts
const defaultRole = await this.roleRepository.findOne({
  where: { Name: 'user' }
});
newUser.roles = [defaultRole];
await this.userRepository.save(newUser);
```

---

### 4️⃣ Protect Your Routes

**For Property Controller** ([property.controller.ts](src/property/property.controller.ts)):

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { RequirePermission } from '../rbac/decorators/require-permission.decorator';

@Controller('properties')
export class PropertyController {

  // Protect create endpoint
  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'properties', action: 'add' })
  create(@Body() dto: CreatePropertyDto) { }

  // Protect update endpoint
  @Put(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'properties', action: 'edit' })
  update(@Param('id') id: number, @Body() dto: UpdatePropertyDto) { }

  // Protect delete endpoint
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'properties', action: 'delete' })
  remove(@Param('id') id: number) { }
}
```

**For Campaign Controller** (src/campaign/campaign.controller.ts):

First, add RbacModule to [campaign.module.ts](src/campaign/campaign.module.ts):
```typescript
import { RbacModule } from '../rbac/rbac.module';

@Module({
  imports: [RbacModule, ...],
  // ...
})
```

Then protect routes:
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RbacGuard } from '../rbac/guards/rbac.guard';
import { RequirePermission } from '../rbac/decorators/require-permission.decorator';

@Controller('campaign')
export class CampaignController {

  @Post()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'campaign', action: 'add' })
  create(@Body() dto: CreateCampaignDto) { }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'campaign', action: 'edit' })
  update(@Param('id') id: number, @Body() dto: UpdateCampaignDto) { }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermission({ resource: 'campaign', action: 'delete' })
  remove(@Param('id') id: number) { }
}
```

---

### 5️⃣ Test Your RBAC System

**A. Login and Get JWT Token**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

Save the JWT token from the response.

**B. Check Your Permissions**
```bash
curl -X GET http://localhost:3000/rbac/my-permissions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**C. Test Protected Endpoint**
```bash
# Try creating a property (should succeed if you have 'add' permission)
curl -X POST http://localhost:3000/properties \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"listing_date":"2025-01-01","listing_price":450000,...}'

# Try deleting a property (should fail if you don't have 'delete' permission)
curl -X DELETE http://localhost:3000/properties/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 Expected Results

### For User with 'user' Role:

**Can Do** ✅:
- POST /properties (has 'add' permission)
- GET /properties (has 'view' permission)
- GET /properties/:id (has 'view' permission)
- GET /campaign (has 'view' permission)
- PUT /campaign/:id (has 'edit' permission)

**Cannot Do** ❌:
- PUT /properties/:id (no 'edit' permission)
- DELETE /properties/:id (no 'delete' permission)
- POST /campaign (no 'add' permission)

### For User with 'super_admin' Role:

**Can Do** ✅:
- ALL endpoints (full permissions)

---

## 🔧 Quick Commands Reference

```bash
# Database
npm run migration:generate      # Generate migration
npm run migration:run          # Run migrations
npm run migration:show         # Show migration status

# Seeding
npm run seed:roles             # Seed default roles

# Development
npm run start:dev              # Start dev server
```

---

## 📚 Need More Info?

- **Complete Guide**: [RBAC-USAGE-GUIDE.md](src/rbac/RBAC-USAGE-GUIDE.md)
- **API Examples**: [api-requests.http](src/rbac/examples/api-requests.http)
- **Controller Examples**: [property-controller-with-rbac.example.ts](src/rbac/examples/property-controller-with-rbac.example.ts)
- **Full Summary**: [RBAC-SETUP-SUMMARY.md](RBAC-SETUP-SUMMARY.md)

---

## ❓ Common Issues

**Q: "User does not have required role"**
A: Assign a role to your user in the `Users_roles_Roles` table.

**Q: "User does not have permission to add properties"**
A: Check the role's permissions. Update via `/rbac/roles/:id` endpoint.

**Q: Migration already exists**
A: Check `npm run migration:show`. If migration is already run, skip to step 2.

**Q: Roles already seeded**
A: The seed script checks and skips if roles exist. This is normal.

---

## 🎉 You're Done!

Your RBAC system is now set up and ready to use. Start protecting your endpoints and managing user permissions!
