# User Registration with Role Assignment - Guide

## Overview

The registration system now supports role assignment during user creation. Users can be assigned specific roles (super_admin, user, manager) when they register.

## Key Features

✅ **Role Assignment During Registration** - Assign roles when creating new users
✅ **Default Role** - Automatically assigns "user" role if none specified
✅ **Role Validation** - Checks if role exists before creating user
✅ **Swagger Documentation** - Full API documentation with examples
✅ **RBAC Integration** - Works seamlessly with the RBAC system

## API Endpoint

**POST** `/register`

### Request Payload

```json
{
  "username": "user@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "first_name": "firstname",
  "last_name": "lastname",
  "phone_number": "+919876543210",
  "role": "super_admin"
}
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| username | string | Yes | Email address (used as username) | user@example.com |
| password | string | Yes | User password | password123 |
| confirm_password | string | Yes | Password confirmation (must match password) | password123 |
| first_name | string | No | User's first name | firstname |
| last_name | string | No | User's last name | lastname |
| phone_number | string | No | Phone number (Indian format) | +919876543210 |
| role | string | No | Role to assign (defaults to "user") | super_admin |

### Available Roles

- **super_admin** - Full permissions on all resources
- **user** - Limited permissions (default)
- **manager** - Partial permissions

## Usage Examples

### 1. Register Super Admin

**Request**:
```json
POST /register
Content-Type: application/json

{
  "username": "admin@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "first_name": "Admin",
  "last_name": "User",
  "phone_number": "+919876543210",
  "role": "super_admin"
}
```

**Response** (201 Created):
```json
{
  "is_success": true,
  "message": "User registered successfully",
  "data": {
    "username": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "phone_number": "+919876543210",
    "role": "super_admin",
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 2. Register Regular User

**Request**:
```json
POST /register
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "first_name": "Regular",
  "last_name": "User",
  "phone_number": "+919876543210",
  "role": "user"
}
```

**Response** (201 Created):
```json
{
  "is_success": true,
  "message": "User registered successfully",
  "data": {
    "username": "user@example.com",
    "first_name": "Regular",
    "last_name": "User",
    "phone_number": "+919876543210",
    "role": "user",
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### 3. Register Without Specifying Role (Defaults to "user")

**Request**:
```json
POST /register
Content-Type: application/json

{
  "username": "newuser@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "first_name": "New",
  "last_name": "User",
  "phone_number": "+919876543210"
}
```

**Note**: If `role` is omitted, the user will be assigned the "user" role by default.

## Error Responses

### 400 Bad Request - Passwords Don't Match
```json
{
  "statusCode": 400,
  "message": "Passwords do not match",
  "error": "Bad Request"
}
```

### 400 Bad Request - User Already Exists
```json
{
  "statusCode": 400,
  "message": "User already exists",
  "error": "Bad Request"
}
```

### 400 Bad Request - Role Not Found
```json
{
  "statusCode": 400,
  "message": "Role 'invalid_role' not found. Please create the role first or use an existing role.",
  "error": "Bad Request"
}
```

## Important Notes

### 1. Create Roles Before Registering Users

Before registering users, ensure the roles exist in the database:

```bash
# Run the seed script to create default roles
npm run seed:roles
```

This creates:
- `super_admin` role with full permissions
- `user` role with limited permissions

### 2. Role Names are Case-Sensitive

Role names must match exactly as they are stored in the database:
- ✅ Correct: `"role": "super_admin"`
- ❌ Wrong: `"role": "Super_Admin"`
- ❌ Wrong: `"role": "SUPER_ADMIN"`

### 3. Only Super Admin Can Manage Roles

After creating a super_admin user:
- Only users with `super_admin` role can create, edit, or delete roles
- Only users with `super_admin` role can modify permissions
- Regular users cannot access `/rbac/roles` endpoints

## Workflow

### Initial Setup (First Time)

1. **Create roles** (if not already done):
   ```bash
   npm run migration:run
   npm run seed:roles
   ```

2. **Register first super admin**:
   ```bash
   POST /register
   {
     "username": "admin@example.com",
     "password": "securepassword",
     "confirm_password": "securepassword",
     "role": "super_admin"
   }
   ```

3. **Login as super admin**:
   ```bash
   POST /login
   {
     "username": "admin@example.com",
     "password": "securepassword"
   }
   ```

4. **Use super admin token** to:
   - Create additional roles via `/rbac/roles`
   - Manage permissions
   - Register other users

### Regular Usage

**For Admins**:
```bash
# Create a new user with specific role
POST /register
{
  "username": "newuser@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "role": "user"
}
```

**For Self-Registration**:
```bash
# Users register themselves (defaults to "user" role)
POST /register
{
  "username": "selfregister@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

## Swagger Documentation

Access the interactive API documentation at:
```
http://localhost:4000/api/docs
```

### Available Examples in Swagger

1. **Register Super Admin** - Full example with super_admin role
2. **Register Regular User** - Example with user role
3. **Register Manager** - Example with manager role

## Code Changes Summary

### Files Updated

1. **[src/register/dtos/register-request.dto.ts](src/register/dtos/register-request.dto.ts)**
   - Added `role` field (optional, defaults to "user")
   - Added Swagger documentation

2. **[src/users/users.service.ts](src/users/users.service.ts)**
   - Added `roleName` parameter to `create()` method
   - Added role repository injection
   - Added role validation logic
   - Returns role name in user object

3. **[src/auth/auth.service.ts](src/auth/auth.service.ts)**
   - Added `role` parameter to `register()` method
   - Passes role to UsersService
   - Returns role in response

4. **[src/register/register.controller.ts](src/register/register.controller.ts)**
   - Updated to pass `role` from request body
   - Enhanced Swagger documentation with 3 examples
   - Improved error handling for role not found

## Security Considerations

### 1. Role Creation is Restricted

Only `super_admin` users can create roles:
```typescript
@Post('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin')  // ← Only super_admin can access
create(@Body() createRoleDto: CreateRoleDto) { }
```

### 2. Self-Registration Defaults to Limited Role

If users self-register without specifying a role, they get the "user" role with limited permissions by default.

### 3. Role Validation

The system validates that the requested role exists before creating the user:
```typescript
if (!role) {
  throw new NotFoundException(`Role '${roleToAssign}' not found.`);
}
```

## Testing

### Using cURL

```bash
# Register super admin
curl -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@example.com",
    "password": "password123",
    "confirm_password": "password123",
    "first_name": "Admin",
    "last_name": "User",
    "phone_number": "+919876543210",
    "role": "super_admin"
  }'
```

### Using Swagger UI

1. Go to `http://localhost:4000/api/docs`
2. Find the `POST /register` endpoint
3. Click "Try it out"
4. Select an example from the dropdown
5. Click "Execute"

### Using Postman

Import this collection or create a new request:
- **Method**: POST
- **URL**: `http://localhost:4000/register`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON): Use the payload examples above

## FAQ

### Q: What happens if I don't specify a role?
**A**: The user will be assigned the "user" role by default.

### Q: Can I change a user's role after registration?
**A**: Currently, role changes require database updates. This functionality can be added to the RBAC module if needed.

### Q: What if the role doesn't exist?
**A**: The system will return a 400 error with the message: "Role 'role_name' not found. Please create the role first."

### Q: Can a user have multiple roles?
**A**: The current implementation assigns one role per registration. The database supports multiple roles, but the registration endpoint currently assigns one role.

### Q: Who can register users with super_admin role?
**A**: Anyone can register with any role through the `/register` endpoint. However, only super_admins can create/modify roles and permissions through the `/rbac/roles` endpoints.

---

## Next Steps

1. **Create your first super admin** using the registration endpoint
2. **Login** to get authentication tokens
3. **Create additional roles** if needed via `/rbac/roles`
4. **Register regular users** with appropriate roles

Your registration system is now fully integrated with RBAC! 🎉
