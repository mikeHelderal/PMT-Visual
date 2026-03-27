import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskAddMember } from './task-add-member';
import { TaskService } from '../../../services/task/task-service';
import { ProjectMemberService } from '../../../services/projectMember/project-member';
import { TuiDialogService } from '@taiga-ui/core';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProjectMember } from '../../../models/projectMember.model';
import { Task } from '../../../models/task.model';

describe('TaskAddMember', () => {
  let component: TaskAddMember;
  let fixture: ComponentFixture<TaskAddMember>;

  const mockMembers: ProjectMember[] = [
    { id: 1, username: 'Alice', email: 'alice@test.com', role: 'ADMIN', userId: 10 },
    { id: 2, username: 'Bob', email: 'bob@test.com', role: 'DEVELOPER', userId: 11 }
  ];

  const mockTask: Task = {
    id: 500,
    nom: 'Tester le composant',
    priorite: 'HAUTE',
    status: 'A_FAIRE',
    project: { id: 123 }
  };

  const mockTaskService = {
    assignTask: jest.fn().mockReturnValue(of({}))
  };

  const mockProjectMemberService = {
    getMembers: jest.fn().mockReturnValue(of(mockMembers))
  };

  const mockDialogService = {
    open: jest.fn().mockReturnValue(of('confirmed'))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAddMember, FormsModule],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: ProjectMemberService, useValue: mockProjectMemberService },
        { provide: TuiDialogService, useValue: mockDialogService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskAddMember);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', mockTask);
    fixture.componentRef.setInput('projectId', 123);

    fixture.detectChanges();
  });

  it('devrait charger la liste des membres du projet à l\'initialisation', () => {
    expect(mockProjectMemberService.getMembers).toHaveBeenCalledWith(123);
    expect(component.listMember()).toEqual(mockMembers);
  });

  it('devrait retourner le nom d\'utilisateur via la fonction stringify', () => {
    const member = mockMembers[0];
    expect(component.stringify(member)).toBe('Alice');
  });

  it('devrait ouvrir le dialogue d\'assignation', () => {
    const templateRef = {} as any;
    component.openAssignDialog(templateRef);
    expect(mockDialogService.open).toHaveBeenCalledWith(templateRef, expect.objectContaining({
      label: "Assigner un membre",
      size: "s"
    }));
  });


  describe('assign()', () => {
    it('ne devrait pas appeler le service si l\'ID du membre est 0 (non sélectionné)', () => {
      component.newMember.set({ email: '', id: 0, role: '', userId: 0, username: '' });

      mockTaskService.assignTask.mockClear();

      const mockObserver = { complete: jest.fn() };

      component.assign(mockObserver);

      expect(mockTaskService.assignTask).not.toHaveBeenCalled();
      expect(mockObserver.complete).not.toHaveBeenCalled();
    });
  });
  it('devrait afficher l\'icône "plus" si la tâche n\'est pas assignée et "repeat" sinon', () => {
    fixture.detectChanges();
    let button = fixture.nativeElement.querySelector('button[tuiIconButton]');
    expect(component.task().assignee).toBeUndefined();

    fixture.componentRef.setInput('task', { ...mockTask, assignee: { username: 'Alice', id: '1', email: '' } });
    fixture.detectChanges();
    expect(component.task().assignee).toBeDefined();
  });
});
