import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskForm } from './task-form';
import { TaskService } from '../../../services/task/task-service';
import { ProjectStateService } from '../../../services/project/project-state-service';
import { NotificationsService } from '../../../services/notifications/notifications';
import { AuthService } from '../../../services/auth/auth';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

describe('TaskForm', () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;

  const mockTaskService = {
    createTask: jest.fn()
  };

  const mockNotifService = {
    show: jest.fn()
  };

  const mockAuthService = {
    getCurrentMemberId: jest.fn().mockReturnValue(10)
  };

  const mockProjectStateService = {
    role: signal('ADMIN'),
    memberId: jest.fn().mockReturnValue(456),
    currentMember: jest.fn().mockReturnValue({ id: 456, role: 'ADMIN' }),
    '_project': signal({ id: 1 }),
    '_userId': signal(10)
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [TaskForm],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: ProjectStateService, useValue: mockProjectStateService },
        { provide: NotificationsService, useValue: mockNotifService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('projectId', 1);
    fixture.detectChanges();
  });

  it('devrait initialiser le membre courant au ngOnInit', () => {
    expect(mockAuthService.getCurrentMemberId).toHaveBeenCalled();
    expect(component.currentMemberId()).toBe(10);
  });

  describe('submitTask()', () => {

    it('devrait créer une tâche avec succès et réinitialiser le formulaire', () => {
      const mockSavedTask = { id: 99, nom: 'Nouvelle Tâche' };
      mockTaskService.createTask.mockReturnValue(of(mockSavedTask));
      mockProjectStateService.memberId.mockReturnValue(456);

      component.newTask.nom = 'Nouvelle Tâche';
      component.submitTask();

      expect(mockTaskService.createTask).toHaveBeenCalled();
      expect(mockNotifService.show).toHaveBeenCalledWith("Tâche'Nouvelle Tâche'créée avec succès !");
    });

    it('devrait afficher une erreur si l\'utilisateur n\'a pas de memberId dans le projet', () => {
      mockProjectStateService.memberId.mockReturnValue(null);

      component.newTask.nom = 'Nouvelle Tâche';
      component.submitTask();

      expect(mockNotifService.show).toHaveBeenCalledWith("Aucun ID de membre trouvé pour ce projet");
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });

    it('devrait gérer l\'erreur de création (ex: droits insuffisants)', () => {
      mockProjectStateService.memberId.mockReturnValue(456);
      mockTaskService.createTask.mockReturnValue(throwError(() => ({ status: 403 })));

      component.newTask.nom = 'Nouvelle Tâche';
      component.submitTask();

      expect(mockNotifService.show).toHaveBeenCalledWith(
        "Impossible de créer la tâche. Vérifiez vos droits.",
        "error"
      );
    });

    it('ne devrait rien envoyer si le formulaire est invalide (nom vide)', () => {
      mockProjectStateService.memberId.mockReturnValue(456);

      component.newTask.nom = '';
      component.submitTask();

      expect(mockTaskService.createTask).not.toHaveBeenCalled();
      expect(component.touched.nom).toBe(true);
      expect(component.result().hasErrors('nom')).toBe(true);
    });
  });

  describe('Validation', () => {
    it('devrait marquer le champ comme touché et valider sur onInput', () => {
      component.onInput('nom');
      expect(component.touched.nom).toBe(true);
      expect(component.result().hasErrors('nom')).toBe(true);
    });
  });

  describe('Libellés affichés dans les listes déroulantes', () => {
    it('devrait traduire chaque priorité', () => {
      expect(component.stringifyPriorite('BASSE')).toBe('Basse');
      expect(component.stringifyPriorite('MOYENNE')).toBe('Moyenne');
      expect(component.stringifyPriorite('HAUTE')).toBe('Haute');
      // Valeur inconnue : affichée telle quelle
      expect(component.stringifyPriorite('URGENTE')).toBe('URGENTE');
    });

    it('devrait traduire chaque statut', () => {
      expect(component.stringifyStatut('A_FAIRE')).toBe('a faire');
      expect(component.stringifyStatut('EN_COURS')).toBe('en cours');
      expect(component.stringifyStatut('TERMINER')).toBe('terminé');
      // Valeur inconnue : affichée telle quelle
      expect(component.stringifyStatut('ARCHIVE')).toBe('ARCHIVE');
    });
  });
});
