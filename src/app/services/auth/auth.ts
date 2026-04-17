import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProjectStateService} from '../project/project-state-service';

/**
 * Service gérant l'authentification et la session utilisateur.
 * Responsable de la communication avec l'API d'authentification,
 * de la gestion de l'état global de l'utilisateur via les Signals
 * et de la persistance locale.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl: string = "http://localhost:8081/api/auth";
  private http = inject(HttpClient);

  private projectStateService: ProjectStateService = inject(ProjectStateService);

  currentUser = signal<any>(null);

  /**
   * Initialise le service en vérifiant la présence d'une session
   * dans le stockage local (localStorage).
   */
  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUser.set(user);
      this.projectStateService.setUserId(user.id);
    }
  }

  /**
   * Enregistre un nouvel utilisateur via l'API.
   * * @param user Objet contenant les informations d'inscription
   * @returns Observable de la réponse du serveur
   */
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  /**
   * Authentifie un utilisateur et initialise la session.
   * En cas de succès, les données sont stockées dans le localStorage
   * et le Signal currentUser est mis à jour.
   * *@param credentials Identifiants de connexion (email, password)
   * @returns Observable contenant l'utilisateur authentifié
   */
  login(credentials: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(`${this.apiUrl}/login`, credentials, httpOptions).pipe(
      tap((response: any) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUser.set(response);

        if (response && response.id) {
          this.projectStateService.setUserId(response.id);
        }

      })
    );
  }

  /**
   * Récupère l'identifiant de membre associé à l'utilisateur connecté.
   * Utile pour les headers de sécurité (X-Member-ID) requis par le backend.
   * @returns L'identifiant du membre ou null
   */
  getCurrentMemberId(): number | null {
    return this.currentUser()?.memberId || null;
  }

  /**
   * Déconnecte l'utilisateur en nettoyant le stockage local et le Signal d'état.
   */
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
  }

}
