import {Component, inject} from '@angular/core';
import {NotificationsService} from '../../../services/notifications/notifications';

@Component({
  selector: 'app-toast-container',
  imports: [],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  public notifService = inject(NotificationsService)

}
