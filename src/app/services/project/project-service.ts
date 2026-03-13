import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Project} from '../../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8081/api/projects';

  getProjectByUserId(userId: number): Observable<Project[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  createProject(projectData: Project){
    return this.http.post<any>(this.apiUrl , projectData);
  }

  getProjectsById(id: number): Observable<Project[]>{
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getProjectById(id: number){
    return this.http.get<Project>(`${this.apiUrl}/project/${id}`);
  }

  deleteProject(id: number,requesterId: number): Observable<void>{
    const headers = new HttpHeaders().set('X-Member-ID', requesterId.toString());
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{headers});
  }

  // Dans ProjectService par exemple
  getUserRoleInProject(project: any, userId: number): string {
    // On cherche le membre dans le projet qui correspond à notre ID utilisateur
    const membership = project.membres?.find((m: any) => m.user.id === userId);
    return membership ? membership.role.libelle : 'GUEST';
  }

  canEditProject(project: any, userId: number): boolean {
    const role = this.getUserRoleInProject(project, userId);
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }

}
