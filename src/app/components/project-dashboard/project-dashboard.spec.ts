import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDashboard } from './project-dashboard';
import { Task } from '../../models/task.model';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';
import { TuiTitle, TuiIcon } from '@taiga-ui/core';
import { TuiPieChart } from '@taiga-ui/addon-charts';

describe('ProjectDashboard', () => {
  let component: ProjectDashboard;
  let fixture: ComponentFixture<ProjectDashboard>;

  const mockTasks: any[] = [
    { id: 1, nom: 'Tâche 1', status: 'A_FAIRE', priorite: 'HAUTE', dateEcheance: '2020-01-01' },
    { id: 2, nom: 'Tâche 2', status: 'EN_COURS', priorite: 'MOYENNE', dateEcheance: '2026-12-31' },
    { id: 3, nom: 'Tâche 3', status: 'TERMINE', priorite: 'BASSE', dateFinReelle: '2024-01-01' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProjectDashboard,
        TuiBadge, TuiCard, TuiHeader, TuiTitle, TuiIcon, TuiPieChart
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDashboard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tasks', mockTasks);
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  describe('Calculs des Signals (Computed)', () => {
    it('devrait filtrer correctement les tâches par statut', () => {
      expect(component.todoTasks().length).toBe(1);
      expect(component.inProgressTasks().length).toBe(1);
      expect(component.doneTasks().length).toBe(1);
    });

    it('devrait calculer le pourcentage de complétion', () => {
      expect(component.completionPercentage()).toBe(33);
    });

    it('devrait retourner 0% si la liste des tâches est vide', () => {
      fixture.componentRef.setInput('tasks', []);
      fixture.detectChanges();
      expect(component.completionPercentage()).toBe(0);
    });

    it('devrait compter les tâches à haute priorité', () => {
      expect(component.highPriorityCount()).toBe(1);
    });

    it('devrait mettre à jour les valeurs du graphique (chartValues)', () => {
      expect(component.chartValues()).toEqual([1, 1, 1]);
    });
  });

  describe('Logique métier (KPIs & Status)', () => {
    it('devrait retourner le bon statut de couleur pour Taiga UI', () => {
      expect(component.getPriorityStatus('HAUTE')).toBe('error');
      expect(component.getPriorityStatus('MOYENNE')).toBe('warning');
      expect(component.getPriorityStatus('BASSE')).toBe('info');
    });

    it('devrait calculer correctement les tâches en retard (calculateKPIs)', () => {
      component.calculateKPIs(mockTasks as Task[]);
      expect(component.overdueCount()).toBe(1);
    });
  });
});
