/**
 * Helper function to transform image filenames to full URLs
 * @param images - Array of image filenames or URLs
 * @param req - Request object to get the base URL
 * @returns Array of full URLs
 */
export function transformImageUrls(
  images: string[],
  baseUrl: string,
): string[] {
  if (!images || images.length === 0) {
    return [];
  }

  return images.map((image) => {
    // If already a full URL, return as is
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    // If it's a filename only (no path), prepend the uploads path
    if (!image.startsWith('/')) {
      return `${baseUrl}/uploads/properties/${image}`;
    }

    // If it's a relative path starting with /, just prepend base URL
    return `${baseUrl}${image}`;
  });
}
