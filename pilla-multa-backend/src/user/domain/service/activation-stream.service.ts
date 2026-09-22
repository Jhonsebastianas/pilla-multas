import { Observable } from 'rxjs';

export interface ActivationStreamService {
  /**
   * Subscribe to the activation stream.
   * @param userId user id
   */
  subscribe(userId: string): Observable<any>;

  /**
   * Notify the activation stream.
   * @param userId user id
   */
  notify(userId: string): void;
}
