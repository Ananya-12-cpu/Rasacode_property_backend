# RBAC Swagger Documentation Guide

## Overview

The RBAC module now has complete Swagger/OpenAPI documentation. You can access the interactive API documentation at:

**URL**: `http://localhost:4000/api/docs`

## What's Documented

### 1. All RBAC Endpoints

Every RBAC endpoint is fully documented with:
- ✅ Operation summary and description
- ✅ Request body schemas with multiple examples
- ✅ Path parameters
- ✅ Response schemas with examples
- ✅ All possible HTTP status codes
- ✅ Authentication requirements

### 2. API Endpoints Documented

| Endpoint | Method | Summary |
|----------|--------|---------|
| `/rbac/roles` | POST | Create a new role with permissions |
| `/rbac/roles` | GET | Get all roles |
| `/rbac/roles/:id` | GET | Get role by ID |
| `/rbac/roles/:id` | PATCH | Update role permissions |
| `/rbac/roles/:id` | DELETE | Delete a role |
| `/rbac/my-permissions` | GET | Get current user permissions |

## Features

### Interactive Examples

Each endpoint includes multiple request examples:

#### POST /rbac/roles - Create Role

**Example 1: User Role**
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

**Example 2: Super Admin Role**
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

**Example 3: Manager Role**
```json
{
  "role": "manager",
  "permission": [
    {
      "campaign": {
        "add": true,
        "view": true,
        "edit": true,
        "delete": false
      },
      "properties": {
        "add": true,
        "view": true,
        "edit": true,
        "delete": false
      }
    }
  ]
}
```

#### PATCH /rbac/roles/:id - Update Role

**Example 1: Update Permissions Only**
```json
{
  "permission": [
    {
      "campaign": {
        "add": true,
        "view": true,
        "edit": true,
        "delete": false
      },
      "properties": {
        "add": true,
        "view": true,
        "edit": true,
        "delete": false
      }
    }
  ]
}
```

**Example 2: Update Role Name Only**
```json
{
  "role": "advanced_user"
}
```

**Example 3: Update Both Name and Permissions**
```json
{
  "role": "manager",
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
        "delete": false
      }
    }
  ]
}
```

### Response Examples

Every endpoint includes detailed response examples:

#### Success Response (201 Created)
```json
{
  "Id": 1,
  "Name": "user",
  "permissions": [
    {
      "id": 1,
      "permissions": {
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
    }
  ]
}
```

#### Error Responses

**401 Unauthorized**
```
Unauthorized - Invalid or missing JWT token
```

**403 Forbidden**
```
Forbidden - User does not have super_admin role
```

**404 Not Found**
```
Not Found - Role with specified ID does not exist
```

**409 Conflict**
```
Conflict - Role already exists
```

## How to Use Swagger UI

### 1. Access Swagger Documentation

Start your server and navigate to:
```
http://localhost:4000/api/docs
```

### 2. Authenticate

1. Click the **"Authorize"** button at the top right
2. Enter your JWT token in the format: `Bearer YOUR_TOKEN_HERE`
3. Click **"Authorize"** then **"Close"**

### 3. Try Out Endpoints

1. Expand any endpoint (e.g., `POST /rbac/roles`)
2. Click **"Try it out"**
3. Select an example from the dropdown or modify the request body
4. Click **"Execute"**
5. View the response below

### 4. View Examples

Each endpoint has multiple examples in the dropdown menu:
- User Role Example
- Super Admin Role Example
- Manager Role Example

Simply select the example you want to use and click "Execute".

## Schema Documentation

### CreateRoleDto

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| role | string | Yes | The name of the role | "user" |
| permission | array | Yes | Array of permission structures | See below |

### PermissionStructureDto

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| campaign | ResourcePermissionDto | Yes | Permissions for campaign resource |
| properties | ResourcePermissionDto | Yes | Permissions for properties resource |

### ResourcePermissionDto

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| add | boolean | Yes | Permission to add/create new resources | true |
| view | boolean | Yes | Permission to view/read resources | true |
| edit | boolean | Yes | Permission to edit/update resources | false |
| delete | boolean | Yes | Permission to delete resources | false |

## Testing with Swagger

### Step 1: Create Super Admin Role

1. Go to `POST /rbac/roles`
2. Click "Try it out"
3. Select "Super Admin Role Example"
4. Click "Execute"
5. You should get a 201 Created response

### Step 2: Create User Role

1. Same endpoint `POST /rbac/roles`
2. Select "User Role Example"
3. Click "Execute"
4. You should get a 201 Created response

### Step 3: Get All Roles

1. Go to `GET /rbac/roles`
2. Click "Try it out"
3. Click "Execute"
4. You should see both roles in the response

### Step 4: Update a Role

1. Go to `PATCH /rbac/roles/{id}`
2. Enter the role ID (e.g., 2)
3. Select "Update Permissions Only" example
4. Click "Execute"
5. You should get a 200 OK response

### Step 5: Check Your Permissions

1. Go to `GET /rbac/my-permissions`
2. Click "Try it out"
3. Click "Execute"
4. You should see your assigned permissions

## Swagger Tags

All RBAC endpoints are grouped under the tag:
**"RBAC - Role & Permission Management"**

This makes it easy to find all RBAC-related endpoints in the Swagger UI.

## Authentication

All endpoints require JWT authentication (indicated by the lock icon 🔒).

Make sure to:
1. Login first to get a JWT token
2. Click "Authorize" in Swagger UI
3. Enter your token with "Bearer " prefix
4. Then you can test the endpoints

## Benefits of Swagger Documentation

### For Developers:
- ✅ Interactive API testing
- ✅ No need for Postman/curl
- ✅ Automatic request validation
- ✅ Real-time feedback
- ✅ Multiple examples for each endpoint

### For Frontend Developers:
- ✅ Clear understanding of request/response formats
- ✅ All possible status codes documented
- ✅ Example payloads to copy
- ✅ No need to read backend code

### For API Consumers:
- ✅ Self-documenting API
- ✅ Always up-to-date with code
- ✅ Easy to understand permission structures
- ✅ Try before you buy

## Customizing Swagger

The Swagger configuration is in [main.ts](../../main.ts):

```typescript
const config = new DocumentBuilder()
  .setTitle('Property Management API')
  .setDescription('APIs for managing properties')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

You can customize:
- **Title**: Change the API title
- **Description**: Update the description
- **Version**: Update the API version
- **Path**: Change `/api/docs` to any path you prefer

## Additional Resources

- **Swagger UI**: `http://localhost:4000/api/docs`
- **OpenAPI JSON**: `http://localhost:4000/api/docs-json`
- **NestJS Swagger Docs**: https://docs.nestjs.com/openapi/introduction

## Troubleshooting

### Issue: "Unauthorized" error in Swagger
**Solution**: Make sure you've clicked "Authorize" and entered a valid JWT token with "Bearer " prefix.

### Issue: Examples not showing
**Solution**: Clear browser cache and refresh the page.

### Issue: Schema not displaying correctly
**Solution**: Check that all DTOs have `@ApiProperty()` decorators.

---

**Your RBAC API is now fully documented with Swagger!** 🎉

Test it at: `http://localhost:4000/api/docs`
