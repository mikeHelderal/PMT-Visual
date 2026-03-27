import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksList } from './tasks-list';
import { TuiDialogService } from '@taiga-ui/core';
import { ProjectStateService } from '../../../services/project/project-state-service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Task } from '../../../models/task.model';

describe('TasksList', () => {
  let component: TasksList;
  let fixture: ComponentFixture<TasksList>;

  const mockDialogService = {
    open: jest.fn().mockReturnValue(of({}))
  };

  const mockProjectStateService = {
    role: 'ADMIN'
  };

  const mockTasks: Task[] = [
    { id: 1, nom: 'Task 1', priorite: 'HAUTE', status: 'A_FAIRE', project: { id: 1 } },
    { id: 2, nom: 'Task 2', priorite: 'BASSE', status: 'TERMINE', project: { id: 1 } }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksList],
      providers: [
        { provide: TuiDialogService, useValue: mockDialogService },
        { provide: ProjectStateService, useValue: mockProjectStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('projectId', 123);
    fixture.componentRef.setInput('tasks', [...mockTasks]);

    fixture.detectChanges();
  });

  it('devrait créer le composant et afficher les tâches', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr[app-task-item]'));
    expect(component).toBeTruthy();
    expect(rows.length).toBe(2);
  });

  it('devrait afficher un message vide quand il n’y a pas de tâches', () => {
    fixture.componentRef.setInput('tasks', []);
    fixture.detectChanges();

    const emptyMessage = fixture.debugElement.query(By.css('td.tui-text_body-m'));
    expect(emptyMessage.nativeElement.textContent).toContain('Aucune tâche');
  });

  it('devrait ouvrir le dialogue de création de tâche', () => {
    const button = fixture.debugElement.query(By.css('button[tuiButton]'));
    button.triggerEventHandler('click', null);

    expect(mockDialogService.open).toHaveBeenCalled();
  });

  describe('Outputs / Événements', () => {
    it('devrait émettre taskDeleted quand un enfant le demande', () => {
      const spy = jest.spyOn(component.taskDeleted, 'emit');
      component.onTaskDeleted(1);
      expect(spy).toHaveBeenCalledWith(1);
    });

    it('devrait émettre taskUpdated quand un enfant signale une mise à jour', () => {
      const spy = jest.spyOn(component.taskUpdated, 'emit');
      component.onTaskUpdated();
      expect(spy).toHaveBeenCalled();
    });

    it('devrait émettre taskCreated quand une tâche est créée dans le dialogue', () => {
      const spy = jest.spyOn(component.taskCreated, 'emit');
      const newTask: Task = { id: 3, nom: 'New', priorite: 'MOYENNE', status: 'A_FAIRE', project: { id: 1 } };

      component.onTaskCreated(newTask);

      expect(spy).toHaveBeenCalledWith(newTask);
    });
  });

  it('devrait récupérer le rôle du ProjectStateService au ngOnInit', () => {
    expect(component.role()).toBe('ADMIN');
  });
});
