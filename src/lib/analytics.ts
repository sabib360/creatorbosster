import { auth, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface ToolEvent {
  toolName: string;
  action: string;
  userId?: string;
  email?: string;
  metadata?: Record<string, unknown>;
  timestamp?: unknown;
}

export async function trackToolEvent(event: ToolEvent) {
  try {
    const userId = auth.currentUser?.uid;
    const email = auth.currentUser?.email;

    if (!userId) {
      console.log('No user logged in, tracking event locally');
      return;
    }

    const eventsCollection = collection(db, 'toolEvents');
    await addDoc(eventsCollection, {
      ...event,
      userId,
      email,
      timestamp: serverTimestamp(),
    });

    console.log(`✓ Tracked: ${event.toolName} - ${event.action}`);
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

export async function trackToolUsage(
  toolName: string,
  action: string,
  metadata?: Record<string, unknown>
) {
  await trackToolEvent({
    toolName,
    action,
    metadata,
  });
}

export async function trackThumbnailGenerated(metadata: {
  textContent?: string;
  designStyle?: string;
  dimensions?: string;
  generatedAt?: string;
}) {
  await trackToolUsage('ThumbnailGenerator', 'thumbnail_generated', metadata);
}

export async function trackThumbnailDownloaded(metadata: {
  thumbnailSize?: string;
  format?: string;
}) {
  await trackToolUsage('ThumbnailGenerator', 'thumbnail_downloaded', metadata);
}

export async function trackThumbnailEdited(metadata: {
  fieldChanged?: string;
  previousValue?: string;
  newValue?: string;
}) {
  await trackToolUsage('ThumbnailGenerator', 'thumbnail_edited', metadata);
}
