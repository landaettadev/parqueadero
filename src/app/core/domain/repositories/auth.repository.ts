import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

/**
 * Repository interface for Authentication operations
 */
export abstract class AuthRepository {
  abstract login(email: string, password: string): Observable<User>;
  abstract logout(): Observable<void>;
  abstract getCurrentUser(): Observable<User | null>;
  abstract isAuthenticated(): boolean;
}
