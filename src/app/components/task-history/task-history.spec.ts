import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { TaskHistory } from './task-history';
import { TaskService } from '../../services/task/task-service';
import { of, throwError } from 'rxjs';
import { TaskHistoryModel } from '../../models/taskHistory.model';
import { DatePipe } from '@angular/common';

describe('TaskHistory', () => {
  let component: TaskHistory;
  let fixture: ComponentFixture<TaskHistory>;

  const mockHistory: TaskHistoryModel[] = [
    {
      id: 1,
      action: 'Tâche créée',
      dateAction: '2024-03-20T10:00:00Z',
      authorMember: { id: 1, username: 'Alice', role: 'ADMIN', email: 'alice@test.com', userId: 10 },
      task: { id: 101 } as any
    },
    {
      id: 2,
      action: 'Statut modifié en EN_COURS',
      dateAction: '2024-03-21T14:30:00Z',
      authorMember: { id: 2, username: 'Bob', role: 'DEVELOPER', email: 'bob@test.com', userId: 11 },
      task: { id: 101 } as any
    }
  ];

  const mockTaskService = {
    getTaskHistory: jest.fn().mockReturnValue(of(mockHistory))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskHistory],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskHistory);
    component = fixture.componentInstance;
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger l\'historique automatiquement quand taskId est défini (via effect)', async () => {
    fixture.componentRef.setInput('taskId', 101);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(mockTaskService.getTaskHistory).toHaveBeenCalledWith(101);
    expect(component.historyItems()).toEqual(mockHistory);
  });

  it('devrait afficher un message si l\'historique est vide', () => {
    mockTaskService.getTaskHistory.mockReturnValue(of([]));
    fixture.componentRef.setInput('taskId', 999);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Aucune trace trouvée pour cette tâche');
  });

  it('devrait afficher les éléments d\'historique dans le DOM', fakeAsync(() => {
    const mockHistory = [
      { id: 1, action: 'Tâche créée', dateAction: new Date(), authorMember: { username: 'Alice', role: 'ADMIN' } },
      { id: 2, action: 'Priorité modifiée', dateAction: new Date(), authorMember: { username: 'Bob', role: 'DEVELOPER' } }
    ];

    mockTaskService.getTaskHistory.mockReturnValue(of(mockHistory));

    fixture.componentRef.setInput('taskId', 123);

    tick();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const items = compiled.querySelectorAll('.tui-space_bottom-3');

    expect(items.length).toBe(2);
    expect(compiled.textContent).toContain('Alice');
    expect(compiled.textContent).toContain('Tâche créée');
    expect(compiled.textContent).toContain('Bob');
  }));

  it('devrait gérer l\'erreur de chargement gracieusement', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const errorResponse = new Error('Server Error');

    mockTaskService.getTaskHistory.mockReturnValue(throwError(() => errorResponse));

    fixture.componentRef.setInput('taskId', 123);
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Erreur lors du chargement de l'historique",
      errorResponse
    );

    consoleSpy.mockRestore();
  });});
