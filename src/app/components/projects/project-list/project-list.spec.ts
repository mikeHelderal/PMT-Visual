import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectList } from './project-list';
import { ProjectService } from '../../../services/project/project-service';
import { AuthService } from '../../../services/auth/auth';
import { TuiDialogService, TuiAlertService } from '@taiga-ui/core';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('ProjectList', () => {
  let component: ProjectList;
  let fixture: ComponentFixture<ProjectList>;

  const mockProjectService = {
    getProjectsById: jest.fn(),
    createProject: jest.fn(),
    deleteProject: jest.fn()
  };

  const mockAuthService = {
    currentUser: signal({ id: 50, name: 'Test User' }),
    getCurrentMemberId: jest.fn().mockReturnValue(50),
    getCurrentMember: jest.fn().mockReturnValue({ id: 50 })
  };

  const mockDialogs = {
    open: jest.fn().mockReturnValue(of({}))
  };

  const mockAlerts = {
    open: jest.fn().mockReturnValue(of(true))
  };

  const dummyProjects = [
    { id: 1, nom: 'Projet A', description: 'Desc A', adminId: 50 },
    { id: 2, nom: 'Projet B', description: 'Desc B', adminId: 99 }
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({ id: 50 }))
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    mockProjectService.getProjectsById.mockReturnValue(of(dummyProjects));

    await TestBed.configureTestingModule({
      imports: [ProjectList],
      providers: [
        provideRouter([]),
        { provide: ProjectService, useValue: mockProjectService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TuiDialogService, useValue: mockDialogs },
        { provide: TuiAlertService, useValue: mockAlerts }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait charger les projets de l\'utilisateur au démarrage', () => {
    expect(mockProjectService.getProjectsById).toHaveBeenCalledWith(50);
    expect(component.projects().length).toBe(2);
  });

  it('devrait ouvrir la modale de création via showDialog', () => {
    const mockTemplate = {} as any;
    component.showDialog(mockTemplate);
    expect(mockDialogs.open).toHaveBeenCalled();
  });

  it('devrait créer un projet et rafraîchir la liste via submitProject', () => {
    mockProjectService.createProject.mockReturnValue(of({}));
    const observerMock = { complete: jest.fn() };

    component.newProject = { nom: 'Nouveau', description: 'Test', dateDebut: '2026-01-01' };
    component.submitProject(observerMock);

    expect(mockProjectService.createProject).toHaveBeenCalled();
    expect(observerMock.complete).toHaveBeenCalled();
    expect(mockProjectService.getProjectsById).toHaveBeenCalledTimes(2);
  });

  describe('deleteProject()', () => {
    it('devrait supprimer un projet après confirmation', () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
      mockProjectService.deleteProject.mockReturnValue(of({}));

      component.deleteProject(1);

      expect(mockProjectService.deleteProject).toHaveBeenCalledWith(1, 50);
      expect(mockAlerts.open).toHaveBeenCalledWith('Projet supprimé');

      confirmSpy.mockRestore();
    });

    it('ne devrait pas appeler le service si l\'utilisateur n\'est pas identifié', () => {
      mockAuthService.getCurrentMemberId.mockReturnValue(null);

      component.deleteProject(1);

      expect(mockProjectService.deleteProject).not.toHaveBeenCalled();
    });
  });
});
