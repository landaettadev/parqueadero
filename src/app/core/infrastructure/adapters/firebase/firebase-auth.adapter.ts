import { Injectable } from '@angular/core';
import { Observable, from, map, of } from 'rxjs';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { AuthRepository } from '@domain/repositories/auth.repository';
import { User } from '@domain/entities/user.entity';
import { getFirebaseAuth, getFirebaseDatabase } from '../../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthAdapter extends AuthRepository {
  private auth = getFirebaseAuth();
  private db = getFirebaseDatabase();
  private currentUser: User | null = null;

  constructor() {
    super();
    // Listen to auth state changes
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        this.currentUser = await this.getUserData(firebaseUser.uid);
      } else {
        this.currentUser = null;
      }
    });
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(async (credential) => {
        const user = await this.getUserData(credential.user.uid);
        this.currentUser = user;
        return user;
      }),
      map(promise => promise as any)
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.currentUser = null;
      })
    );
  }

  getCurrentUser(): Observable<User | null> {
    return of(this.currentUser);
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  private async getUserData(uid: string): Promise<User> {
    const userRef = ref(this.db, `users/${uid}`);
    const snapshot = await get(userRef);
    const data = snapshot.val();
    
    return {
      id: uid,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      createdAt: new Date(data.createdAt)
    };
  }
}
