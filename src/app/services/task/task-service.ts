import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Statut, Task} from '../../models/task.model';
import {Observable} from 'rxjs';
import {TaskHistoryModel} from '../../models/taskHistory.model';

/**
 * Service central pour la gestion des tâches.
 * Communique avec l'API Backend pour assurer le cycle de vie des tâches,
 * l'assignation des membres, le suivi des statuts et la récupération de l'audit.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl : string = 'http://localhost:8081/api/tasks';

  /**
   * Récupère toutes les tâches associées à un projet.
   * * @param projectId Identifiant du projet
   * @returns Observable d'un tableau de tâches
   */
  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`);
  }

  /**
   * Crée une nouvelle tâche.
   * * @param task L'objet tâche à créer
   * * @param memberId ID du créateur pour validation des droits (Header X-Member-ID)
   * @returns Observable de la tâche créée
   */
  createTask(task: Task, memberId: number): Observable<Task>{
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.post<Task>(this.apiUrl, task, {headers});
  }

  /**
   * Met à jour les informations générales d'une tâche existante.
   * * @param id Identifiant de la tâche
   * * @param task Objet contenant les modifications partielles
   * * @param memberId ID de l'auteur de la modification
   * @returns Observable de la tâche mise à jour
   */
  updateTask(id: number, task: Partial<Task>,memberId: number): Observable<Task>{
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, { headers: headers });
  }

  /**
   * Change uniquement le statut d'une tâche.
   * * @param taskId Identifiant de la tâche
   * * @param status Nouveau statut (A_FAIRE, EN_COURS, TERMINE)
   * * @param memberId ID de l'auteur pour historisation
   * @returns Observable de la tâche avec son nouveau statut
   */
  updateTaskStatus(taskId: number, status: Statut,memberId: number): Observable<Task> {
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/status`, status, { headers: headers });
  }

  /**
   * Assigne une tâche à un membre spécifique du projet.
   * @param taskId Identifiant de la tâche
   * @param projectId Identifiant du projet parent (pour vérification de cohérence)
   * @param memberId Identifiant du membre à assigner
   * @returns Observable de la tâche mise à jour
   */
  assignTask(taskId: number, projectId: number, memberId: number) {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/assign`, {
      projectId,
      memberId,
    });
  }

  /**
   * Supprime une tâche de manière définitive.
   * @param taskId Identifiant de la tâche à supprimer
   * @param memberId ID du demandeur (doit être ADMIN)
   * @returns Observable de confirmation de suppression
   */
  deleteTask(taskId: number, memberId: number): Observable<void>{
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`, {headers});
  }

  /**
   * Récupère l'historique des actions (audit trail) d'une tâche.
   * @param taskId Identifiant de la tâche
   * @returns Observable de la liste chronologique des événements
   */
  getTaskHistory(taskId: number): Observable<TaskHistoryModel[]> {
    return this.http.get<TaskHistoryModel[]>(`${this.apiUrl}/${taskId}/history`);
  }

}
