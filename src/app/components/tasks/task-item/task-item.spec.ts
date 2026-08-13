import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItem } from './task-item';
import { TaskService } from '../../../services/task/task-service';
import { ProjectStateService } from '../../../services/project/project-state-service';
import { Task } from '../../../models/task.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

describe('TaskItem', () => {
  let component: TaskItem;
  let fixture: ComponentFixture<TaskItem>;

  const mockTask: Task = {
    id: 1,
    nom: 'Tâche Initiale',
    priorite: 'MOYENNE',
    status: 'A_FAIRE',
    project: { id: 101 },
    dateEcheance: '2023-12-31'
  };

  const mockTaskService = {
    updateTask: jest.fn().mockReturnValue(of({})),
    updateTaskStatus: jest.fn().mockReturnValue(of({})),
    deleteTask: jest.fn().mockReturnValue(of(undefined))
  };

  const mockProjectStateService = {
    role: signal('ADMIN'),
    memberId: () => 55,
    currentMember: () => ({ id: 55, role: 'ADMIN' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItem],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: ProjectStateService, useValue: mockProjectStateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItem);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('task', { ...mockTask });
    fixture.componentRef.setInput('projectId', 101);

    (component as any).member = { id: 55 };

    fixture.detectChanges();
  });

  it('devrait afficher le nom de la tâche par défaut', () => {
    const span = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(span.textContent).toContain('Tâche Initiale');
  });

  describe('Changement de Statut', () => {
    it('devrait passer de A_FAIRE à EN_COURS', () => {
      component.changeStatus();

      expect(mockTaskService.updateTaskStatus).toHaveBeenCalledWith(1, 'EN_COURS', 55);
      expect(component.task().status).toBe('EN_COURS');
    });

    it('devrait passer de TERMINE à A_FAIRE (cycle complet)', () => {
      component.task().status = 'TERMINE';
      component.changeStatus();
      expect(component.task().status).toBe('A_FAIRE');
    });
  });

  describe('Sauvegarde du nom', () => {
    it('devrait mettre à jour le nom si celui-ci a changé', () => {
      component.isEditing.set(true);
      const nouveauNom = 'Nom Modifié';

      component.saveName(nouveauNom);

      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, { nom: nouveauNom }, 55);
      expect(component.isEditing()).toBe(false);
    });

    it('devrait simplement fermer le mode édition si le nom est identique', () => {
      component.isEditing.set(true);
      mockTaskService.updateTask.mockClear();

      component.saveName('Tâche Initiale');

      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
      expect(component.isEditing()).toBe(false);
    });
  });

  it('devrait retourner la bonne apparence selon la priorité', () => {
    expect(component.getPriorityAppearance('HAUTE')).toBe('danger');
    expect(component.getPriorityAppearance('MOYENNE')).toBe('warning');
    expect(component.getPriorityAppearance('BASSE')).toBe('success');
    // Priorité inconnue : on retombe sur l'apparence neutre
    expect(component.getPriorityAppearance('INCONNUE' as any)).toBe('neutral');
  });

  describe('Changement de priorité', () => {
    it('devrait passer à la priorité suivante du cycle', () => {
      mockTaskService.updateTask.mockClear();

      component.changePriority();

      expect(mockTaskService.updateTask).toHaveBeenCalledWith(1, { priorite: 'HAUTE' }, 55);
      expect(component.task().priorite).toBe('HAUTE');
    });

    it('devrait revenir à BASSE après HAUTE (cycle complet)', () => {
      component.task().priorite = 'HAUTE';

      component.changePriority();

      expect(component.task().priorite).toBe('BASSE');
    });
  });

  describe('Garde-fou : membre du projet inconnu', () => {
    beforeEach(() => {
      // Simule un localStorage sans utilisateur courant
      (component as any).member = {};
      mockTaskService.updateTask.mockClear();
      mockTaskService.updateTaskStatus.mockClear();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => jest.restoreAllMocks());

    it('changeStatus() ne doit rien envoyer sans identifiant de membre', () => {
      component.changeStatus();
      expect(mockTaskService.updateTaskStatus).not.toHaveBeenCalled();
    });

    it('changePriority() ne doit rien envoyer sans identifiant de membre', () => {
      component.changePriority();
      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    });

    it('saveName() ne doit rien envoyer sans identifiant de membre', () => {
      component.saveName('Autre nom');
      expect(mockTaskService.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('Suppression', () => {
    afterEach(() => jest.restoreAllMocks());

    it('devrait supprimer la tâche après confirmation', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      const emitSpy = jest.spyOn(component.taskDeleted, 'emit');

      component.onDelete();

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1, 55);
      expect(emitSpy).toHaveBeenCalledWith(1);
    });

    it('ne devrait rien supprimer si l’utilisateur annule', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(false);
      mockTaskService.deleteTask.mockClear();

      component.onDelete();

      expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
    });
  });

  describe('Mode édition', () => {
    it('toggleEdit() devrait inverser l’état d’édition', () => {
      expect(component.isEditing()).toBe(false);

      component.toggleEdit();
      expect(component.isEditing()).toBe(true);

      component.toggleEdit();
      expect(component.isEditing()).toBe(false);
    });

    it('updateTask() devrait notifier le parent', () => {
      const emitSpy = jest.spyOn(component.taskUpdated, 'emit');

      component.updateTask();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  it('ngOnInit() devrait récupérer le rôle depuis le service d’état du projet', () => {
    component.ngOnInit();
    expect(component.role()).toBe(mockProjectStateService.role);
  });
});
