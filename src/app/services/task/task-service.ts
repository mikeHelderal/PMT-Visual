import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

  updateTask(id: number, task: Partial<Task>): Observable<Task>{
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task);
  }

  updateTaskStatus(taskId: number, status: Statut): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${taskId}/status`, {status})
  }

  deleteTask(taskId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${taskId}`);
  }

}
