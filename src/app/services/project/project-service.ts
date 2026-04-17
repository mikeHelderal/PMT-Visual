import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from '../../models/project.model';

/**
 * Service gérant les communications avec l'API de gestion des projets.
 * Centralise les opérations CRUD et expose des méthodes utilitaires
 * pour le contrôle des droits d'accès au niveau de l'interface.
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8081/api/projects';

  /**
   * Récupère la liste des projets administrés par un utilisateur spécifique.
   * * @param userId Identifiant de l'utilisateur (Admin)
   * @returns Observable d'un tableau de projets
   */
  getProjectByUserId(userId: number): Observable<Project[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Crée un nouveau projet dans le système.
   * * @param projectData Objet projet à enregistrer
   * @returns Observable de la réponse serveur
   */
  createProject(projectData: Project){
    return this.http.post<any>(this.apiUrl , projectData);
  }

  /**
   * Récupère les projets via un identifiant (usage spécifique).
   * * @param id Identifiant recherché
   * @returns Observable d'un tableau de projets
   */
  getProjectsById(id: number): Observable<Project[]>{
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère les détails complets d'un projet par son ID unique.
   * * @param id Identifiant du projet
   * @returns Observable de l'objet Project
   */
  getProjectById(id: number){
    return this.http.get<Project>(`${this.apiUrl}/project/${id}`);
  }

  /**
   * Supprime un projet de manière sécurisée.
   * Transmet l'ID du demandeur dans les headers pour validation côté serveur.
   * * @param id Identifiant du projet à supprimer
   * * @param requesterId ID de l'utilisateur demandant la suppression (pour contrôle de sécurité)
   * @returns Observable vide confirmant la suppression
   */
  deleteProject(id: number,requesterId: number): Observable<void>{
    const headers = new HttpHeaders().set('X-Member-ID', requesterId.toString());
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{headers});
  }

  /**
   * Analyse la structure d'un projet pour déterminer le rôle d'un utilisateur donné.
   * * @param project Objet projet contenant la liste des membres
   * * @param userId ID de l'utilisateur à vérifier
   * @returns Le libellé du rôle (ADMIN, MEMBER, etc.) ou 'GUEST' par défaut
   */
  getUserRoleInProject(project: any, userId: number): string {
    const membership = project.membres?.find((m: any) => m.user.id === userId);
    return membership ? membership.role.libelle : 'GUEST';
  }

  /**
   * Détermine si un utilisateur possède les privilèges nécessaires pour éditer un projet.
   * * @param project Objet projet concerné
   * * @param userId ID de l'utilisateur demandeur
   * @returns Vrai si l'utilisateur est administrateur
   */
  canEditProject(project: any, userId: number): boolean {
    const role = this.getUserRoleInProject(project, userId);
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }

}
