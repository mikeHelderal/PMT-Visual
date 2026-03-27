import { TestBed } from '@angular/core/testing';
import { ProjectStateService } from './project-state-service';

describe('ProjectStateService', () => {
  let service: ProjectStateService;

  const mockProject = {
    id: 101,
    nom: 'Projet Test',
    membres: [
      {
        id: 50,
        user: { id: 1, nom: 'Alice' },
        role: { libelle: 'ADMIN' }
      },
      {
        id: 51,
        user: { id: 2, nom: 'Bob' },
        role: { libelle: 'MEMBER' }
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectStateService]
    });
    service = TestBed.inject(ProjectStateService);
  });

  it('devrait être initialisé avec le rôle GUEST par défaut', () => {
    expect(service.role()).toBe('GUEST');
    expect(service.currentMember()).toBeNull();
  });

  it('devrait calculer le rôle ADMIN quand l\'utilisateur 1 est défini', () => {
    service.setProject(mockProject);
    service.setUserId(1);

    expect(service.role()).toBe('ADMIN');
    expect(service.memberId()).toBe(50);
  });

  it('devrait changer pour le rôle MEMBER pour l\'utilisateur 2', () => {
    service.setProject(mockProject);
    service.setUserId(2);

    expect(service.role()).toBe('MEMBER');
    expect(service.memberId()).toBe(51);
  });

  it('devrait retourner GUEST si l\'utilisateur (ID 99) n\'est pas dans la liste des membres', () => {
    service.setProject(mockProject);
    service.setUserId(99);

    expect(service.role()).toBe('GUEST');
    expect(service.currentMember()).toBeNull();
  });

  it('devrait gérer un projet sans membres sans planter', () => {
    service.setProject({ id: 102, membres: [] });
    service.setUserId(1);

    expect(service.role()).toBe('GUEST');
    expect(service.currentMember()).toBeNull();
  });
});
