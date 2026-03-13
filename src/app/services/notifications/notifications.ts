import {Injectable, signal} from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  public toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = Date.now();
    const newToast: Toast = {id, message,type};

    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => this.remove(id), 4000);

  }

  remove(id: number){
    this.toasts.update(current => current.filter(t => t.id !== id));
  }


}
