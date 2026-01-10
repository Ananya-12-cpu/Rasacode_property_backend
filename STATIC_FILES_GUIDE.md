# Static Files Configuration for Property Images

## Overview
The Property API now returns full URLs for uploaded images in all GET endpoints (GET all properties, GET by ID).

## How It Works

### 1. File Upload (POST /properties)
When you upload images via the create endpoint:
- Files are saved to `./uploads/properties/` directory
- Filenames are stored in the database
- Response returns full URLs to the images

### 2. File Retrieval (GET endpoints)
All GET endpoints automatically transform image filenames to full URLs:
- **GET /properties** - Returns all properties with full image URLs
- **GET /properties/:id** - Returns a single property with full image URLs

### 3. Static File Serving
The server is configured to serve uploaded files at:
```
http://localhost:3000/uploads/properties/{filename}
```

## Implementation Details

### Controller Layer
- Uses `@Req()` decorator to access the request object
- Extracts base URL: `${req.protocol}://${req.get('host')}`
- Calls `transformImageUrls()` helper function to convert filenames to URLs

### Helper Function
Located at: `src/common/helpers/file-url.helper.ts`

The helper function:
- Checks if the image is already a full URL (starts with http:// or https://)
- If it's a filename, prepends the base URL and uploads path
- Returns an array of full URLs

### Static Assets Configuration
In `main.ts`:
```typescript
app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  prefix: '/uploads/',
});
```

## Example Responses

### POST /properties (Create)
```json
{
  "is_success": true,
  "message": "Property created successfully",
  "data": {
    "id": 1,
    "street_address": "123 Main Street",
    "images": [
      "http://localhost:3000/uploads/properties/images-1736509876543-123456789.jpg",
      "http://localhost:3000/uploads/properties/images-1736509876543-987654321.jpg"
    ],
    ...
  }
}
```

### GET /properties (Get All)
```json
{
  "is_success": true,
  "message": "Properties fetched successfully",
  "data": [
    {
      "id": 1,
      "street_address": "123 Main Street",
      "images": [
        "http://localhost:3000/uploads/properties/images-1736509876543-123456789.jpg",
        "http://localhost:3000/uploads/properties/images-1736509876543-987654321.jpg"
      ],
      ...
    },
    {
      "id": 2,
      "street_address": "456 Oak Avenue",
      "images": [
        "http://localhost:3000/uploads/properties/images-1736509999999-111111111.jpg"
      ],
      ...
    }
  ]
}
```

### GET /properties/:id (Get By ID)
```json
{
  "is_success": true,
  "message": "Property fetched successfully",
  "data": {
    "id": 1,
    "street_address": "123 Main Street",
    "images": [
      "http://localhost:3000/uploads/properties/images-1736509876543-123456789.jpg",
      "http://localhost:3000/uploads/properties/images-1736509876543-987654321.jpg"
    ],
    ...
  }
}
```

## Direct Image Access

Images can be accessed directly in the browser:
```
http://localhost:3000/uploads/properties/images-1736509876543-123456789.jpg
```

## Benefits

1. **Frontend-Ready URLs**: No need to construct URLs on the frontend
2. **Environment-Aware**: URLs adapt to the server's protocol and host
3. **Backward Compatible**: Works with both uploaded files and external URLs
4. **Consistent**: All endpoints return the same URL format

## Testing

### Test with cURL
```bash
# Get all properties
curl -X GET http://localhost:3000/properties

# Get property by ID
curl -X GET http://localhost:3000/properties/1

# Access image directly
curl -X GET http://localhost:3000/uploads/properties/images-1736509876543-123456789.jpg
```

### Test with Browser
1. Create a property with images via POST /properties
2. Note the image URLs in the response
3. Visit GET /properties to see all properties with image URLs
4. Visit GET /properties/:id to see a single property with image URLs
5. Click on any image URL to view the image directly

## Notes

- The uploads directory is excluded from git (`.gitignore`)
- Image URLs are dynamically generated based on the request's protocol and host
- This works in any environment (localhost, staging, production) without configuration changes
- If you need to use a CDN or external storage, the helper function can be easily modified
