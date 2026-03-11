import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Statut, Task} from '../../models/task.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl : string = 'http://localhost:8081/api/tasks';

  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/projects/${projectId}`);
  }

  createTask(task: Task): Observable<Task>{
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Partial<Task>,memberId: number): Observable<Task>{
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task, { headers: headers });
  }

  updateTaskStatus(taskId: number, status: Statut,memberId: number): Observable<Task> {
    const headers = new HttpHeaders().set('X-Member-ID', memberId.toString());
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/status`, status, { headers: headers });
  }

  deleteTask(taskId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

  getTaskHistory(taskId: number): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${this.apiUrl}/${taskId}/history`);
  }

}
