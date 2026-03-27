import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task-service';
import { Task } from '../../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8081/api/tasks';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('devrait récupérer les tâches d\'un projet', () => {
    const mockTasks: Task[] = [{ id: 1, nom: 'Test Task', status: 'A_FAIRE', priorite: 'MOYENNE', project: { id: 101 } }];

    service.getTasksByProject(101).subscribe((tasks: Task[]) => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne(`${apiUrl}/project/101`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('devrait créer une tâche avec le header X-Member-ID', () => {
    const newTask: Task = { nom: 'New Task', status: 'A_FAIRE', priorite: 'HAUTE', project: { id: 101 } };

    service.createTask(newTask, 50).subscribe((res) => {
      expect(res).toEqual(newTask);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.headers.get('X-Member-ID')).toBe('50');
    expect(req.request.method).toBe('POST');
    req.flush(newTask);
  });

  it('devrait mettre à jour le statut via PATCH avec le bon type', () => {
    service.updateTaskStatus(1, 'TERMINE', 50).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toBe('TERMINE');
    req.flush({});
  });
});
