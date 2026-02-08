# RBAC (Role-Based Access Control) Guide

## Architecture Overview

```
Organization
  |
  |--- Roles (scoped per org)
  |      |--- Permissions (JSON: resource -> action)
  |
  |--- Users (belong to one org)
         |--- assigned Roles (many-to-many)
```

**Database Tables**: `Users`, `Roles`, `Permissions`, `organizations`

- Each **Organization** has its own set of Roles
- Each **Role** has one or more Permission records (stored as JSON)
- Each **User** belongs to one Organization and can have multiple Roles
- `super_admin` is a system-level role (no organization)

---

## Step-by-Step Setup

### Step 1: Seed the Super Admin

The super admin is the system-level user who can manage everything.

```bash
npx ts-node src/rbac/seeds/seed-superadmin.ts
```

This creates:
- **User**: `superadmin@example.com` / `password123`
- **Role**: `super_admin` (assigned to this user)

### Step 2: Login as Super Admin

```
POST /auth/login
```
```json
{
  "username": "superadmin@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "is_success": true,
  "message": "User loggedin successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "superadmin@example.com",
      "first_name": "Super",
      "last_name": "Admin",
      "roles": ["super_admin"],
      "organization": null
    },
    "subscription": null,
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG..."
    }
  }
}
```

Save the `accessToken` - use it as `Bearer <token>` for all authenticated requests.

### Step 3: Create Organization (if not exists)

```
POST /organizations
Authorization: Bearer <super_admin_token>
```
```json
{
  "name": "Enterprise Corp",
  "industry": "Real Estate",
  "size": "50-100"
}
```

Note the `id` from the response (e.g., `4`).

### Step 4: Create Roles for the Organization

```
POST /rbac/roles
Authorization: Bearer <super_admin_token>
```
```json
{
  "role": "enterprise_owner",
  "role_title": "Enterprise Owner",
  "organization_id": 4,
  "permission": [
    {
      "campaign": { "add": true, "view": true, "edit": true, "delete": true },
      "properties": { "add": true, "view": true, "edit": true, "delete": true },
      "user_management": { "add": true, "view": true, "edit": true, "delete": true },
      "buyer": { "add": true, "view": true, "edit": true, "delete": true },
      "seller": { "add": true, "view": true, "edit": true, "delete": true },
      "broker": { "add": true, "view": true, "edit": true, "delete": true }
    }
  ]
}
```

Create more roles as needed:

```json
{
  "role": "manager",
  "organization_id": 4,
  "permission": [
    {
      "campaign": { "add": true, "view": true, "edit": true, "delete": false },
      "properties": { "add": true, "view": true, "edit": true, "delete": false },
      "user_management": { "add": false, "view": true, "edit": false, "delete": false },
      "buyer": { "add": true, "view": true, "edit": true, "delete": false },
      "seller": { "add": true, "view": true, "edit": true, "delete": false },
      "broker": { "add": false, "view": true, "edit": false, "delete": false }
    }
  ]
}
```

```json
{
  "role": "viewer",
  "organization_id": 4,
  "permission": [
    {
      "campaign": { "add": false, "view": true, "edit": false, "delete": false },
      "properties": { "add": false, "view": true, "edit": false, "delete": false },
      "user_management": { "add": false, "view": false, "edit": false, "delete": false },
      "buyer": { "add": false, "view": true, "edit": false, "delete": false },
      "seller": { "add": false, "view": true, "edit": false, "delete": false },
      "broker": { "add": false, "view": true, "edit": false, "delete": false }
    }
  ]
}
```

### Step 5: Add Users with Roles

Enterprise owners (users with `user_management.add` permission) can add new users to their organization:

```
POST /users
Authorization: Bearer <enterprise_owner_token>
```
```json
{
  "username": "john@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+919876543210",
  "role": "manager"
}
```

**Response**:
```json
{
  "is_success": true,
  "message": "User added successfully",
  "data": {
    "id": 5,
    "username": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+919876543210",
    "organization_id": 4,
    "role": "manager"
  }
}
```

- The new user is auto-assigned to the **creator's organization**
- The `role` must be an existing role **within that organization**

---

## Permission Resources & Actions

### Resources

| Resource | Description |
|----------|-------------|
| `campaign` | Campaign management |
| `properties` | Property listings |
| `user_management` | Managing users and roles |
| `buyer` | Buyer records |
| `seller` | Seller records |
| `broker` | Broker records |

### Actions

| Action | Description |
|--------|-------------|
| `add` | Create new records |
| `view` | Read/list records |
| `edit` | Update existing records |
| `delete` | Delete records |

### Permission JSON Structure

Each permission record is stored as JSON:
```json
{
  "campaign": { "add": true, "view": true, "edit": true, "delete": false },
  "properties": { "add": true, "view": true, "edit": false, "delete": false },
  "user_management": { "add": false, "view": true, "edit": false, "delete": false },
  "buyer": { "add": true, "view": true, "edit": true, "delete": false },
  "seller": { "add": false, "view": true, "edit": false, "delete": false },
  "broker": { "add": false, "view": true, "edit": false, "delete": false }
}
```

---

## API Reference

### Authentication

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | None | Login and get tokens |
| `/auth/logout` | POST | None | Logout user |
| `/register` | POST | None | Self-register (public) |

### Role Management

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/rbac/roles` | POST | JWT | Create role (super_admin or user_management.add) |
| `/rbac/roles` | GET | JWT + super_admin | Get all roles (optional `?organization_id=`) |
| `/rbac/roles/:id` | GET | JWT + super_admin | Get role by ID |
| `/rbac/roles/:id` | PATCH | JWT + super_admin | Update role |
| `/rbac/roles/:id` | DELETE | JWT + super_admin | Delete role |
| `/rbac/my-permissions` | GET | JWT | Get current user's permissions |

### User Management

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/users` | POST | JWT + user_management.add | Add user to your org with role |
| `/users` | GET | None | List all users (with pagination) |
| `/users/:id` | GET | None | Get user by ID |
| `/users/:id` | PUT | None | Update user profile |

---

## Access Control Rules

### Who Can Do What

| Action | super_admin | Enterprise Owner (user_management.add) | Regular User |
|--------|-------------|----------------------------------------|--------------|
| Create roles | Any org (pass `organization_id`) | Own org only (auto-assigned) | No |
| View all roles | Yes (`GET /rbac/roles`) | No | No |
| Create users | No (use `/register`) | Own org only (`POST /users`) | No |
| View permissions | Own permissions | Own permissions | Own permissions |

### Role Creation Logic

```
POST /rbac/roles
  |
  |-- Is user super_admin?
  |     YES --> Use organization_id from request body
  |     NO  --> Check user_management.add permission
  |               |
  |               YES --> Auto-assign creator's organization_id
  |               NO  --> 403 Forbidden
```

### User Creation Logic

```
POST /users
  |
  |-- JwtAuthGuard: Is user authenticated?
  |     NO  --> 401 Unauthorized
  |
  |-- RbacGuard: Does user have user_management.add?
  |     NO  --> 403 Forbidden
  |
  |-- Does user belong to an organization?
  |     NO  --> 403 "Not attached to any organization"
  |
  |-- Does the role exist in the user's organization?
  |     NO  --> 404 "Role not found in your organization"
  |
  |-- Create user with:
        - Creator's organization
        - Specified role
```

---

## Protecting Endpoints

### Using @RequirePermission

Add permission checks to any controller endpoint:

```typescript
@Post()
@UseGuards(JwtAuthGuard, RbacGuard)
@ApiBearerAuth()
@RequirePermission({ resource: 'properties', action: 'add' })
async createProperty(@Body() dto: CreatePropertyDto) {
  // Only users with properties.add = true can access
}
```

### Using @Roles (role name check)

```typescript
@Get('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')
async getAllRoles() {
  // Only super_admin role can access
}
```

### Available Resource + Action Combinations

```typescript
@RequirePermission({ resource: 'campaign', action: 'add' })
@RequirePermission({ resource: 'campaign', action: 'view' })
@RequirePermission({ resource: 'campaign', action: 'edit' })
@RequirePermission({ resource: 'campaign', action: 'delete' })

@RequirePermission({ resource: 'properties', action: 'add' })
@RequirePermission({ resource: 'properties', action: 'view' })
// ... same for edit, delete

@RequirePermission({ resource: 'user_management', action: 'add' })
@RequirePermission({ resource: 'buyer', action: 'view' })
@RequirePermission({ resource: 'seller', action: 'edit' })
@RequirePermission({ resource: 'broker', action: 'delete' })
```

---

## Complete Workflow Example

### 1. Setup (one-time)

```bash
# Seed super admin user and role
npx ts-node src/rbac/seeds/seed-superadmin.ts
```

### 2. Super Admin: Login

```
POST /auth/login
{ "username": "superadmin@example.com", "password": "password123" }
```

### 3. Super Admin: Create Roles for an Organization

```
POST /rbac/roles
Authorization: Bearer <super_admin_token>

{
  "role": "enterprise_owner",
  "organization_id": 4,
  "permission": [{
    "campaign": { "add": true, "view": true, "edit": true, "delete": true },
    "properties": { "add": true, "view": true, "edit": true, "delete": true },
    "user_management": { "add": true, "view": true, "edit": true, "delete": true },
    "buyer": { "add": true, "view": true, "edit": true, "delete": true },
    "seller": { "add": true, "view": true, "edit": true, "delete": true },
    "broker": { "add": true, "view": true, "edit": true, "delete": true }
  }]
}
```

### 4. Enterprise Owner: Login and Add Team Members

```
POST /auth/login
{ "username": "owner@enterprise.com", "password": "password123" }
```

```
POST /users
Authorization: Bearer <owner_token>

{
  "username": "manager@enterprise.com",
  "password": "password123",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "manager"
}
```

### 5. Manager: Login and Use Permissions

```
POST /auth/login
{ "username": "manager@enterprise.com", "password": "password123" }
```

```
GET /rbac/my-permissions
Authorization: Bearer <manager_token>
```

**Response**:
```json
[
  {
    "role": "manager",
    "role_title": "Manager",
    "permissions": [
      {
        "campaign": { "add": true, "view": true, "edit": true, "delete": false },
        "properties": { "add": true, "view": true, "edit": true, "delete": false },
        "user_management": { "add": false, "view": true, "edit": false, "delete": false },
        "buyer": { "add": true, "view": true, "edit": true, "delete": false },
        "seller": { "add": true, "view": true, "edit": true, "delete": false },
        "broker": { "add": false, "view": true, "edit": false, "delete": false }
      }
    ]
  }
]
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/entities/role.entity.ts` | Role entity (belongs to Organization) |
| `src/entities/permission.entity.ts` | Permission entity (JSON storage) |
| `src/entities/user.entity.ts` | User entity (many-to-many with Roles) |
| `src/entities/organization.entity.ts` | Organization entity |
| `src/rbac/rbac.controller.ts` | RBAC API endpoints |
| `src/rbac/rbac.service.ts` | Role/Permission CRUD + checkPermission |
| `src/rbac/guards/rbac.guard.ts` | Guard for @RequirePermission and @Roles |
| `src/rbac/decorators/require-permission.decorator.ts` | @RequirePermission decorator |
| `src/rbac/decorators/roles.decorator.ts` | @Roles decorator |
| `src/rbac/dto/create-role.dto.ts` | Role creation DTO |
| `src/rbac/dto/permission-structure.dto.ts` | Permission structure validation |
| `src/users/users.controller.ts` | POST /users (add user with role) |
| `src/users/users.service.ts` | addUser (org-scoped role assignment) |
| `src/auth/auth.service.ts` | Login response with roles |
| `src/auth/jwt.strategy.ts` | JWT payload (includes roles + org) |
| `src/rbac/seeds/seed-superadmin.ts` | Seed script for super_admin |

---

## Swagger

Access full interactive API docs at:

```
http://localhost:4000/api/docs
```
