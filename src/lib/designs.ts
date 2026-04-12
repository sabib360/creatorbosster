import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface SavedDesign {
  id: string;
  name: string;
  timestamp: number;
  preview: string;
  state: string;
  userId?: string;
}

const DESIGNS_KEY = 'thumbmagic_saved_designs';

// Local storage fallback for guests
function getLocalDesigns(): SavedDesign[] {
  try {
    const data = localStorage.getItem(DESIGNS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load local designs:', error);
    return [];
  }
}

export async function getDesigns(userId?: string): Promise<SavedDesign[]> {
  const localDesigns = getLocalDesigns();
  if (!userId) return localDesigns;

  try {
    const q = query(
      collection(db, 'designs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const remoteDesigns = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: (doc.data().timestamp as Timestamp)?.toMillis() || Date.now()
    } as SavedDesign));

    // Merge local and remote, avoiding duplicates if any (though unlikely with current ID logic)
    return [...remoteDesigns, ...localDesigns].sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'designs');
    return localDesigns; // Fallback to local if firestore fails
  }
}

export async function saveToLocal(design: Omit<SavedDesign, 'id' | 'timestamp'>, existingId?: string): Promise<SavedDesign> {
  const timestamp = Date.now();
  const designs = getLocalDesigns();
  
  if (existingId) {
    const index = designs.findIndex(d => d.id === existingId);
    if (index >= 0) {
      const updatedDesign = { ...designs[index], ...design, timestamp };
      designs[index] = updatedDesign;
      localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs));
      return updatedDesign;
    }
  }
  
  const newDesign = { id: 'local_' + Date.now().toString(), ...design, timestamp };
  localStorage.setItem(DESIGNS_KEY, JSON.stringify([newDesign, ...designs].slice(0, 20)));
  return newDesign;
}

export async function saveDesign(design: Omit<SavedDesign, 'id' | 'timestamp'>, userId?: string, existingId?: string): Promise<SavedDesign> {
  const timestamp = Date.now();
  
  if (userId) {
    try {
      if (existingId) {
        const docRef = doc(db, 'designs', existingId);
        await updateDoc(docRef, {
          ...design,
          timestamp: serverTimestamp()
        });
        return { id: existingId, ...design, timestamp, userId };
      } else {
        const docRef = await addDoc(collection(db, 'designs'), {
          ...design,
          userId,
          timestamp: serverTimestamp()
        });
        return { id: docRef.id, ...design, timestamp, userId };
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'designs');
      throw error;
    }
  } else {
    const designs = getLocalDesigns();
    if (existingId) {
      const index = designs.findIndex(d => d.id === existingId);
      if (index >= 0) {
        const updatedDesign = { ...designs[index], ...design, timestamp };
        designs[index] = updatedDesign;
        localStorage.setItem(DESIGNS_KEY, JSON.stringify(designs));
        return updatedDesign;
      }
    }
    
    const newDesign = { id: Date.now().toString(), ...design, timestamp };
    localStorage.setItem(DESIGNS_KEY, JSON.stringify([newDesign, ...designs].slice(0, 20)));
    return newDesign;
  }
}

export async function deleteDesign(id: string, userId?: string) {
  if (id.startsWith('local_')) {
    const designs = getLocalDesigns();
    const updated = designs.filter(d => d.id !== id);
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(updated));
    return;
  }

  if (userId) {
    try {
      await deleteDoc(doc(db, 'designs', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `designs/${id}`);
    }
  } else {
    const designs = getLocalDesigns();
    const updated = designs.filter(d => d.id !== id);
    localStorage.setItem(DESIGNS_KEY, JSON.stringify(updated));
  }
}
