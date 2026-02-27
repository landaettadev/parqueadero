import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { ref, get, set, remove, onValue, push } from 'firebase/database';
import { QueueRepository } from '@domain/repositories/queue.repository';
import { QueueEntry } from '@domain/entities/queue-entry.entity';
import { getFirebaseDatabase } from '../../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseQueueAdapter extends QueueRepository {
  private db = getFirebaseDatabase();

  getQueue(): Observable<QueueEntry[]> {
    const queueRef = ref(this.db, 'queue');
    
    return new Observable(observer => {
      onValue(queueRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const queue = Object.keys(data)
            .map(key => ({
              id: key,
              ...data[key],
              joinedAt: new Date(data[key].joinedAt)
            }))
            .sort((a, b) => a.position - b.position);
          observer.next(queue);
        } else {
          observer.next([]);
        }
      }, (error) => {
        observer.error(error);
      });
    });
  }

  getUserPosition(userId: string): Observable<QueueEntry | null> {
    const queueRef = ref(this.db, 'queue');
    
    return from(get(queueRef)).pipe(
      map(snapshot => {
        const data = snapshot.val();
        if (!data) return null;
        
        const entry = Object.keys(data).find(key => data[key].userId === userId);
        if (!entry) return null;
        
        return {
          id: entry,
          ...data[entry],
          joinedAt: new Date(data[entry].joinedAt)
        };
      })
    );
  }

  joinQueue(userId: string): Observable<QueueEntry> {
    const queueRef = ref(this.db, 'queue');
    
    return from(get(queueRef)).pipe(
      map(snapshot => {
        const data = snapshot.val();
        const currentQueue = data ? Object.values(data) as any[] : [];
        const position = currentQueue.length + 1;
        
        const newEntry: Omit<QueueEntry, 'id'> = {
          userId,
          position,
          joinedAt: new Date(),
          estimatedWaitMinutes: (position - 1) * 5,
          status: 'WAITING'
        };
        
        const newEntryRef = push(queueRef);
        set(newEntryRef, {
          ...newEntry,
          joinedAt: newEntry.joinedAt.toISOString()
        });
        
        return {
          id: newEntryRef.key!,
          ...newEntry
        };
      })
    );
  }

  leaveQueue(userId: string): Observable<void> {
    const queueRef = ref(this.db, 'queue');
    
    return from(get(queueRef)).pipe(
      map(snapshot => {
        const data = snapshot.val();
        if (!data) return;
        
        const entryKey = Object.keys(data).find(key => data[key].userId === userId);
        if (entryKey) {
          const entryRef = ref(this.db, `queue/${entryKey}`);
          remove(entryRef);
        }
      })
    );
  }

  notifyNextInQueue(): Observable<void> {
    // Implementación para notificar al siguiente en la cola
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }
}
