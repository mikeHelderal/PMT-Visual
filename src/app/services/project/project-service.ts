import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  deleteProject(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
