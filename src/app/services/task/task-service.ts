import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Statut, Task} from '../../models/task.model';
import {Observable} from 'rxjs';
import {TaskHistoryModel} from '../../models/taskHistory.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl : string = 'http://localhost:8081/api/tasks';

  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/project/${projectId}`);
  }

  createTask(task: Task, memberId: number): Observable<Task>{
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.post<Task>(this.apiUrl, task, {headers});
  }

  updateTask(id: number, task: Partial<Task>,memberId: number): Observable<Task>{
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, { headers: headers });
  }

  updateTaskStatus(taskId: number, status: Statut,memberId: number): Observable<Task> {
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/status`, status, { headers: headers });
  }

  assignTask(taskId: number, projectId: number, memberId: number) {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/assign`, {
      projectId,
      memberId,
    });
  }

  deleteTask(taskId: number, memberId: number): Observable<void>{
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`, {headers});
  }

  getTaskHistory(taskId: number): Observable<TaskHistoryModel[]> {
    return this.http.get<TaskHistoryModel[]>(`${this.apiUrl}/${taskId}/history`);
  }

}
