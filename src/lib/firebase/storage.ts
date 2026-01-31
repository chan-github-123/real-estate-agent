import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { storage } from './config'

export async function uploadImage(
  file: File,
  path: string
): Promise<{ url: string; path: string } | null> {
  if (!storage) {
    console.error('Firebase storage not initialized')
    return null
  }

  // Validate file
  if (!file || !(file instanceof File)) {
    console.error('Invalid file provided')
    return null
  }

  // Check file size (max 10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  if (file.size > MAX_FILE_SIZE) {
    console.error('File size exceeds 10MB limit')
    return null
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    console.error('Invalid file type. Only JPEG, PNG, and WebP are allowed')
    return null
  }

  try {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return { url, path }
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export async function deleteImage(path: string): Promise<boolean> {
  if (!storage) return false
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

export function generateImagePath(propertyId: string, fileName: string): string {
  const timestamp = Date.now()
  const ext = fileName.split('.').pop()
  return `properties/${propertyId}/${timestamp}.${ext}`
}
