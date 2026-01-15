import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryConstraint,
  increment
} from 'firebase/firestore'
import { db } from './config'
import type { PropertyWithImages, PropertyFilters } from '@/types/property'
import type { Inquiry } from '@/types/inquiry'

// ============ Properties ============

export async function getProperties(filters?: PropertyFilters): Promise<PropertyWithImages[]> {
  if (!db) return []
  try {
    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc')
    ]

    if (filters?.status) {
      constraints.unshift(where('status', '==', filters.status))
    }
    if (filters?.property_type) {
      constraints.unshift(where('propertyType', '==', filters.property_type))
    }
    if (filters?.transaction_type) {
      constraints.unshift(where('transactionType', '==', filters.transaction_type))
    }
    if (filters?.city) {
      constraints.unshift(where('city', '==', filters.city))
    }

    const q = query(collection(db, 'properties'), ...constraints, limit(50))
    const snapshot = await getDocs(q)

    const properties: PropertyWithImages[] = []

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()
      const imagesSnapshot = await getDocs(collection(db, 'properties', docSnap.id, 'images'))
      const images = imagesSnapshot.docs.map(img => ({
        id: img.id,
        ...img.data()
      }))

      properties.push({
        id: docSnap.id,
        ...convertTimestamps(data),
        property_images: images
      } as PropertyWithImages)
    }

    return properties
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

export async function getProperty(id: string): Promise<PropertyWithImages | null> {
  if (!db) return null
  try {
    const docRef = doc(db, 'properties', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const imagesSnapshot = await getDocs(collection(db, 'properties', id, 'images'))
    const images = imagesSnapshot.docs.map(img => ({
      id: img.id,
      ...img.data()
    }))

    // Increment view count
    await updateDoc(docRef, {
      viewCount: increment(1)
    })

    return {
      id: docSnap.id,
      ...convertTimestamps(docSnap.data()),
      property_images: images
    } as PropertyWithImages
  } catch (error) {
    console.error('Error fetching property:', error)
    return null
  }
}

export async function createProperty(data: Omit<DocumentData, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!db) return { id: null, error: 'Database not initialized' }
  try {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...data,
      viewCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export async function updateProperty(id: string, data: Partial<DocumentData>) {
  if (!db) return { error: 'Database not initialized' }
  try {
    const docRef = doc(db, 'properties', id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteProperty(id: string) {
  if (!db) return { error: 'Database not initialized' }
  try {
    await deleteDoc(doc(db, 'properties', id))
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// ============ Property Images ============

export async function addPropertyImage(propertyId: string, imageData: DocumentData) {
  if (!db) return { id: null, error: 'Database not initialized' }
  try {
    const docRef = await addDoc(collection(db, 'properties', propertyId, 'images'), {
      ...imageData,
      createdAt: Timestamp.now()
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

// ============ Inquiries ============

export async function getInquiries(): Promise<Inquiry[]> {
  if (!db) return []
  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Inquiry[]
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return []
  }
}

export async function createInquiry(data: Omit<DocumentData, 'id' | 'createdAt'>) {
  if (!db) return { id: null, error: 'Database not initialized' }
  try {
    const docRef = await addDoc(collection(db, 'inquiries'), {
      ...data,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

// ============ Consultations ============

export async function getConsultations() {
  if (!db) return []
  try {
    const q = query(collection(db, 'consultations'), orderBy('preferredDate', 'asc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    }))
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return []
  }
}

export async function createConsultation(data: Omit<DocumentData, 'id' | 'createdAt'>) {
  if (!db) return { id: null, error: 'Database not initialized' }
  try {
    const docRef = await addDoc(collection(db, 'consultations'), {
      ...data,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

// ============ Stats ============

export async function getStats() {
  if (!db) return { totalProperties: 0, availableProperties: 0, pendingInquiries: 0, pendingConsultations: 0 }
  try {
    const [propertiesSnap, inquiriesSnap, consultationsSnap] = await Promise.all([
      getDocs(collection(db, 'properties')),
      getDocs(query(collection(db, 'inquiries'), where('status', '==', 'pending'))),
      getDocs(query(collection(db, 'consultations'), where('status', '==', 'pending')))
    ])

    const availableCount = propertiesSnap.docs.filter(doc => doc.data().status === 'available').length

    return {
      totalProperties: propertiesSnap.size,
      availableProperties: availableCount,
      pendingInquiries: inquiriesSnap.size,
      pendingConsultations: consultationsSnap.size
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      totalProperties: 0,
      availableProperties: 0,
      pendingInquiries: 0,
      pendingConsultations: 0
    }
  }
}

// ============ Helpers ============

function convertTimestamps(data: DocumentData): DocumentData {
  const result: DocumentData = {}
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString()
    } else {
      result[key] = value
    }
  }
  return result
}
