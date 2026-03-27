import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCard } from './project-card';
import { AuthService } from '../../../services/auth/auth';
import { provideRouter } from '@angular/router';
import { Project } from '../../../models/project.model';
import { signal } from '@angular/core';

describe('ProjectCard', () => {
  let component: ProjectCard;
  let fixture: ComponentFixture<ProjectCard>;

  const mockAuthService = {
    currentUser: signal<any>(null)
  };

  const mockProject: Project = {
    id: 1,
    nom: 'Projet Test',
    description: 'Une description de test',
    adminId: 42,
    dateDebut: '2024-01-01T10:00:00Z',
    createdAt: '2024-01-01T10:00:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCard],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('project', mockProject);
    fixture.detectChanges();
  });

  it('devrait afficher les informations du projet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Projet Test');
    expect(compiled.textContent).toContain('Une description de test');
  });

  describe('Logique de suppression (canDelete)', () => {
    it('devrait retourner true et afficher le bouton supprimer si l\'utilisateur est admin', () => {
      mockAuthService.currentUser.set({ id: 42 });
      fixture.detectChanges();

      expect(component.canDelete).toBe(true);
      const deleteButton = fixture.nativeElement.querySelector('button[appearance="accent"]');
      expect(deleteButton).toBeTruthy();
    });

    it('devrait retourner false et cacher le bouton supprimer si l\'utilisateur n\'est pas admin', () => {
      mockAuthService.currentUser.set({ id: 99 });
      fixture.detectChanges();

      expect(component.canDelete).toBe(false);
      const deleteButton = fixture.nativeElement.querySelector('button[appearance="accent"]');
      expect(deleteButton).toBeNull();
    });

    it('devrait émettre l\'ID du projet lors du clic sur supprimer', () => {
      mockAuthService.currentUser.set({ id: 42 });
      fixture.detectChanges();

      const emitSpy = jest.spyOn(component.onDelete, 'emit');
      const deleteButton = fixture.nativeElement.querySelector('button[appearance="accent"]');

      deleteButton.click();

      expect(emitSpy).toHaveBeenCalledWith(1);
    });
  });
});
