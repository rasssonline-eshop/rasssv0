/**
 * Image Upload Utility Functions
 * Handles image validation, upload, and cleanup for product images
 * Requirements: 9.3, 9.4, 9.5
 */

// Supported image formats
const VALID_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

const VALID_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate image format
 * Requirement 9.3: Validate that files are valid image formats
 */
export function validateImageFormat(file: File): { valid: boolean; error?: string } {
  // Check MIME type
  if (!VALID_IMAGE_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid image format. Supported formats: JPEG, PNG, WebP, GIF`
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = VALID_IMAGE_EXTENSIONS.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file extension. Supported extensions: ${VALID_IMAGE_EXTENSIONS.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Validate image file size
 * Requirement 9.3: Add file size validation
 */
export function validateImageSize(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${sizeMB}MB`
    };
  }

  return { valid: true };
}

/**
 * Validate image URL format
 * Checks if a string is a valid image URL
 */
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
  // Check if it's a data URL (base64)
  if (url.startsWith('data:image/')) {
    return { valid: true };
  }

  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'Image URL must use HTTP or HTTPS protocol'
      };
    }

    // Check if URL ends with valid image extension or is from known CDN
    const hasValidExtension = VALID_IMAGE_EXTENSIONS.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    const isKnownCDN = url.includes('imagekit.io') || 
                       url.includes('cloudinary.com') ||
                       url.includes('amazonaws.com');

    if (!hasValidExtension && !isKnownCDN) {
      return {
        valid: false,
        error: 'Image URL must point to a valid image file'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid image URL format'
    };
  }
}

/**
 * Upload product images
 * Requirement 9.4: Store images securely and generate accessible URLs
 * 
 * This function handles image upload and returns accessible URLs.
 * In production, this would upload to a cloud storage service (ImageKit, Cloudinary, S3, etc.)
 * For now, it converts images to base64 data URLs for storage.
 */
export async function uploadProductImages(
  files: File[]
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    // Validate all files first
    for (const file of files) {
      // Validate format
      const formatValidation = validateImageFormat(file);
      if (!formatValidation.valid) {
        return {
          success: false,
          error: formatValidation.error
        };
      }

      // Validate size
      const sizeValidation = validateImageSize(file);
      if (!sizeValidation.valid) {
        return {
          success: false,
          error: sizeValidation.error
        };
      }
    }

    // Upload all files and generate URLs
    const urls: string[] = [];

    for (const file of files) {
      // In production, upload to cloud storage service
      // For now, convert to base64 data URL
      const url = await convertFileToDataUrl(file);
      urls.push(url);
    }

    return {
      success: true,
      urls
    };
  } catch (error: any) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload images'
    };
  }
}

/**
 * Convert File to data URL (base64)
 * Helper function for image upload
 */
function convertFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Delete product images
 * Requirement 9.5: Remove all associated images from storage when product is deleted
 * 
 * This function handles cleanup of product images.
 * In production, this would delete images from cloud storage service.
 * For base64 data URLs, no cleanup is needed as they're stored in the database.
 */
export async function deleteProductImages(
  imageUrls: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // For data URLs (base64), no cleanup needed
    // They're stored in the database and will be removed with the product record
    
    // In production with cloud storage:
    // - Parse image URLs to extract file IDs
    // - Call cloud storage API to delete files
    // - Handle errors for individual file deletions
    
    const externalUrls = imageUrls.filter(url => !url.startsWith('data:'));
    
    if (externalUrls.length > 0) {
      // TODO: Implement cloud storage deletion
      // For now, log the URLs that would be deleted
      console.log('Images to delete from cloud storage:', externalUrls);
    }

    return {
      success: true
    };
  } catch (error: any) {
    console.error('Image deletion error:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete images'
    };
  }
}

/**
 * Validate multiple image URLs
 * Helper function to validate an array of image URLs
 */
export function validateImageUrls(
  urls: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (let i = 0; i < urls.length; i++) {
    const validation = validateImageUrl(urls[i]);
    if (!validation.valid) {
      errors.push(`Image ${i + 1}: ${validation.error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get image file extension from URL or data URL
 */
export function getImageExtension(url: string): string | null {
  // For data URLs, extract from MIME type
  if (url.startsWith('data:image/')) {
    const match = url.match(/data:image\/(\w+);/);
    if (match) {
      return `.${match[1]}`;
    }
  }

  // For regular URLs, extract from path
  const match = url.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
  if (match) {
    return `.${match[1].toLowerCase()}`;
  }

  return null;
}
