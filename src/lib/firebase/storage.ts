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
