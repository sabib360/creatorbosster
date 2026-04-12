import { YoutubeIdeas } from './gemini';
import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, arrayUnion } from 'firebase/firestore';

export interface GeneratedThumbnail {
  idea: string;
  imageUrls: string[];
  selectedIndex?: number;
}

export interface HistoryItem {
  id: string;
  topic: string;
  results?: YoutubeIdeas;
  thumbnails: GeneratedThumbnail[];
  createdAt: number;
  userId?: string;
}

const HISTORY_KEY = 'creatorboost_history_v2';
const MAX_LOCAL_ITEMS = 15; // Limit items to prevent localStorage quota issues

// Local storage fallback for guests
function getLocalHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load local history:', error);
    return [];
  }
}

function setLocalHistory(history: HistoryItem[]) {
  try {
    // Prune history to keep only the most recent items
    const prunedHistory = history.slice(0, MAX_LOCAL_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(prunedHistory));
  } catch (error: any) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.warn('LocalStorage quota exceeded, pruning history further...');
      // If still failing, try keeping even fewer items
      try {
        const aggressivePruned = history.slice(0, Math.floor(MAX_LOCAL_ITEMS / 2));
        localStorage.setItem(HISTORY_KEY, JSON.stringify(aggressivePruned));
      } catch (innerError) {
        console.error('Failed to save even pruned history:', innerError);
        // Last resort: clear history if it's completely stuck
        localStorage.removeItem(HISTORY_KEY);
      }
    } else {
      console.error('Failed to save local history:', error);
    }
  }
}

export async function getHistory(userId?: string): Promise<HistoryItem[]> {
  if (!userId) return getLocalHistory();

  try {
    const q = query(
      collection(db, 'history'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as HistoryItem));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'history');
    return [];
  }
}

export async function saveIdeasToHistory(topic: string, results: YoutubeIdeas, userId?: string): Promise<HistoryItem> {
  const newItem: Omit<HistoryItem, 'id'> = {
    topic,
    results,
    thumbnails: [],
    createdAt: Date.now(),
    userId
  };

  if (userId) {
    try {
      const docRef = await addDoc(collection(db, 'history'), newItem);
      return { id: docRef.id, ...newItem };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'history');
      throw error;
    }
  } else {
    const history = getLocalHistory();
    const itemWithId = { id: crypto.randomUUID(), ...newItem };
    setLocalHistory([itemWithId, ...history]);
    return itemWithId;
  }
}

export async function addThumbnailsToHistory(historyId: string, idea: string, imageUrls: string[], userId?: string) {
  if (userId) {
    try {
      const docRef = doc(db, 'history', historyId);
      await updateDoc(docRef, {
        thumbnails: arrayUnion({ idea, imageUrls })
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `history/${historyId}`);
    }
  } else {
    const history = getLocalHistory();
    const itemIndex = history.findIndex(item => item.id === historyId);
    if (itemIndex >= 0) {
      // Limit images stored locally to save space
      const limitedImages = imageUrls.slice(0, 2); 
      history[itemIndex].thumbnails.push({ idea, imageUrls: limitedImages });
      setLocalHistory(history);
    }
  }
}

export async function saveThumbnailToHistory(topic: string, imageUrl: string, userId?: string): Promise<HistoryItem> {
  const newItem: Omit<HistoryItem, 'id'> = {
    topic,
    thumbnails: [{ idea: topic, imageUrls: [imageUrl], selectedIndex: 0 }],
    createdAt: Date.now(),
    userId
  };

  if (userId) {
    try {
      const docRef = await addDoc(collection(db, 'history'), newItem);
      return { id: docRef.id, ...newItem };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'history');
      throw error;
    }
  } else {
    const history = getLocalHistory();
    const itemWithId = { id: crypto.randomUUID(), ...newItem };
    setLocalHistory([itemWithId, ...history]);
    return itemWithId;
  }
}

export async function deleteFromHistory(id: string, userId?: string) {
  if (userId) {
    try {
      await deleteDoc(doc(db, 'history', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `history/${id}`);
    }
  } else {
    const history = getLocalHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    setLocalHistory(updatedHistory);
  }
}

export async function clearHistory(userId?: string) {
  if (userId) {
    try {
      const q = query(collection(db, 'history'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'history');
    }
  } else {
    localStorage.removeItem(HISTORY_KEY);
  }
}

export async function updateThumbnailSelectionInHistory(historyId: string, idea: string, selectedIndex: number, userId?: string) {
  if (userId) {
    try {
      const docRef = doc(db, 'history', historyId);
      const querySnapshot = await getDocs(query(collection(db, 'history'), where('__name__', '==', historyId)));
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data() as HistoryItem;
        const updatedThumbnails = data.thumbnails.map(t => 
          t.idea === idea ? { ...t, selectedIndex } : t
        );
        await updateDoc(docRef, { thumbnails: updatedThumbnails });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `history/${historyId}`);
    }
  } else {
    const history = getLocalHistory();
    const itemIndex = history.findIndex(item => item.id === historyId);
    if (itemIndex >= 0) {
      const thumbIndex = history[itemIndex].thumbnails.findIndex(t => t.idea === idea);
      if (thumbIndex >= 0) {
        history[itemIndex].thumbnails[thumbIndex].selectedIndex = selectedIndex;
        setLocalHistory(history);
      }
    }
  }
}
