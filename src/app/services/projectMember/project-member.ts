import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * Service gérant les membres des projets et les invitations.
 * Permet d'administrer les collaborateurs d'un projet en assurant
 * la transmission des droits d'accès via les headers de sécurité.
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081/api/members';

  /**
   * Invite un nouvel utilisateur dans un projet.
   * * @param projectId Identifiant du projet concerné
   * * @param email Adresse email de l'utilisateur à ajouter
   * * @param roleName Libellé du rôle à lui attribuer (ADMIN, MEMBER, etc.)
   * * @param requesterId ID de l'administrateur effectuant l'ajout (pour contrôle de sécurité)
   * @returns Observable de la réponse serveur contenant le nouveau membre
   */
  addMember(projectId: number, email: string, roleName: string, requesterId: number): Observable<any> {
    const headers = new HttpHeaders().set('X-Member-ID', requesterId.toString());
    return this.http.post(`${this.apiUrl}/addMember/${projectId}`, {
      email,
      roleName,
    },{headers});
  }


  /**
   * Récupère la liste de tous les membres d'un projet donné.
   * * @param projectId Identifiant du projet
   * @returns Observable d'un tableau de membres (ProjectMemberResponse)
   */
  getMembers(projectId: number): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/project/${projectId}`);
  }

  /**
   * Retire un membre d'un projet.
   * * @param memberId Identifiant de la relation membre à supprimer
   * * @param requesterId ID de l'utilisateur demandant la suppression (pour vérification des droits)
   * @returns Observable vide confirmant la suppression
   */
  removeMember(memberId: number, requesterId: number): Observable<void> {
    const headers = new HttpHeaders().set('X-Member-ID', requesterId.toString());
    return this.http.delete<void>(`${this.apiUrl}/${memberId}`,{headers});
  }
}
