import {Injectable, signal} from '@angular/core';

/**
 * Interface définissant la structure d'une notification (Toast).
 */
export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

/**
 * Service utilitaire de gestion des notifications "Toasts" à l'écran.
 * Utilise les Angular Signals pour diffuser les alertes de manière réactive
 * à travers toute l'application.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  public toasts = signal<Toast[]>([]);

  /**
   * Affiche une nouvelle notification et programme sa disparition automatique.
   * * @param message Le texte à afficher
   * * @param type Le style de la notification (par défaut 'success')
   */
  show(message: string, type: 'success' | 'error' | 'info' = 'success') {
    const id = Date.now();
    const newToast: Toast = {id, message,type};

    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => this.remove(id), 4000);

  }

  /**
   * Supprime une notification spécifique de la liste.
   * * @param id L'identifiant unique de la notification à retirer
   */
  remove(id: number){
    this.toasts.update(current => current.filter(t => t.id !== id));
  }


}
