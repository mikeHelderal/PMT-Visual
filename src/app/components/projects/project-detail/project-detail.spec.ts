import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProjectDetail } from './project-detail';
import { TaskService } from '../../../services/task/task-service';
import { ProjectService } from '../../../services/project/project-service';
import { AuthService } from '../../../services/auth/auth';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('ProjectDetail', () => {
  let component: ProjectDetail;
  let fixture: ComponentFixture<ProjectDetail>;

  const mockTaskService = {
    deleteTask: jest.fn(),
    getTasksByProject: jest.fn().mockReturnValue(of([]))
  };

  const mockProjectService = {
    getProjectById: jest.fn().mockReturnValue(of({ id: 1, nom: 'Test Project' }))
  };

  const mockAuthService = {
    getCurrentMemberId: jest.fn().mockReturnValue(50)
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1')
      }
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ProjectDetail],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TaskService, useValue: mockTaskService },
        { provide: ProjectService, useValue: mockProjectService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetail);
    component = fixture.componentInstance;
  });

  it('devrait initialiser le projet et les tâches au démarrage', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockProjectService.getProjectById).toHaveBeenCalledWith(1);

    expect(mockTaskService.getTasksByProject).toHaveBeenCalledWith(1);
  }));

  describe('removeTaskFromList()', () => {
    it('devrait supprimer une tâche après confirmation', () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
      mockTaskService.deleteTask.mockReturnValue(of({}));

      component.removeTaskFromList(10);

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(10, 50);
      confirmSpy.mockRestore();
    });

    it('ne devrait pas supprimer si l\'utilisateur annule', () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

      component.removeTaskFromList(10);

      expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });
  });
});
