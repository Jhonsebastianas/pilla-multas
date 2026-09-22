import { Injectable } from '@nestjs/common';
import { ActivationStreamService } from '@user/domain/service/activation-stream.service';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ActivationStreamServiceImpl implements ActivationStreamService {
  private clients = new Map<string, Subject<any>>();

  subscribe(userId: string): Observable<any> {
    const subject = new Subject<any>();
    this.clients.set(userId, subject);
    return subject.asObservable();
  }

  notify(userId: string) {
    const client = this.clients.get(userId);

    if (client) {
      client.next({ data: { activated: true } });
      client.complete();
      this.clients.delete(userId);
    }
  }
}
