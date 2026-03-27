import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectMemberList } from './project-member-list';
import { ProjectMemberService } from '../../services/projectMember/project-member';
import { AuthService } from '../../services/auth/auth';
import { TuiAlertService } from '@taiga-ui/core';
import { of, throwError } from 'rxjs';

describe('ProjectMemberList', () => {
  let component: ProjectMemberList;
  let fixture: ComponentFixture<ProjectMemberList>;

  const mockMembers = [
    { id: 1, user: { id: 10 }, username: 'Alice', role: 'ADMIN' },
    { id: 2, user: { id: 11 }, username: 'Bob', role: 'MEMBER' }
  ];

  const mockMemberService = {
    getMembers: jest.fn().mockReturnValue(of(mockMembers)),
    removeMember: jest.fn()
  };

  const mockAuthService = {
    getCurrentMemberId: jest.fn().mockReturnValue(1)
  };

  const mockAlerts = {
    open: jest.fn().mockReturnValue(of({}))
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ProjectMemberList],
      providers: [
        { provide: ProjectMemberService, useValue: mockMemberService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TuiAlertService, useValue: mockAlerts }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMemberList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('projectId', 1);
  });

  describe('Gestion du projectMemberId dans le localStorage', () => {
    it('devrait stocker le projectMemberId si l\'utilisateur actuel est dans la liste', () => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 10 }));

      component.loadMembers();

      expect(localStorage.getItem('projectMemberId')).toBe('1');
    });

    it('devrait supprimer le projectMemberId si l\'utilisateur n\'est pas dans le projet', () => {
      localStorage.setItem('currentUser', JSON.stringify({ id: 99 }));
      localStorage.setItem('projectMemberId', 'ancienne-valeur');

      component.loadMembers();

      expect(localStorage.getItem('projectMemberId')).toBeNull();
    });
  });

  describe('deleteMember()', () => {
    it('devrait appeler removeMember après confirmation', () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
      mockMemberService.removeMember.mockReturnValue(of({}));

      component.deleteMember(2);

      expect(mockMemberService.removeMember).toHaveBeenCalledWith(2, 1);
      confirmSpy.mockRestore();
    });

    it('ne devrait rien faire si l\'utilisateur annule la confirmation', () => {
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
      mockMemberService.removeMember.mockClear();

      component.deleteMember(2);

      expect(mockMemberService.removeMember).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('devrait gérer l\'erreur 403 (droits insuffisants)', () => {
      jest.spyOn(window, 'confirm').mockReturnValue(true);
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      mockMemberService.removeMember.mockReturnValue(throwError(() => ({ status: 403 })));

      component.deleteMember(2);

      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("n'avez pas les droits d'administrateur"));
      alertSpy.mockRestore();
    });
  });
});
