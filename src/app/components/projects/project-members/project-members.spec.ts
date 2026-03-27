import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectMembers } from './project-members';
import { ProjectMemberService } from '../../../services/projectMember/project-member';
import { AuthService } from '../../../services/auth/auth';
import { TuiAlertService } from '@taiga-ui/core';
import { of, throwError } from 'rxjs';

if (typeof document !== 'undefined') {
  (document as any).execCommand = jest.fn(() => true);
}

describe('ProjectMembers', () => {
  let component: ProjectMembers;
  let fixture: ComponentFixture<ProjectMembers>;

  const mockMemberService = { addMember: jest.fn() };
  const mockAuthService = { getCurrentMemberId: jest.fn() };
  const mockAlerts = { open: jest.fn().mockReturnValue(of(true)) };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockAuthService.getCurrentMemberId.mockReturnValue(50);

    await TestBed.configureTestingModule({
      imports: [ProjectMembers],
      providers: [
        { provide: ProjectMemberService, useValue: mockMemberService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TuiAlertService, useValue: mockAlerts }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMembers);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projectId', 123);
    fixture.detectChanges();
  });

  it('devrait valider la logique de désactivation du formulaire', async () => {

    component.email.set('');
    fixture.detectChanges();

    expect(component.email()).toBe('');


    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();

    component.email.set('test@test.com');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.email()).toBe('test@test.com');
  });

  describe('onAddMember()', () => {
    it('devrait ajouter un membre avec succès et réinitialiser le champ email', () => {
      mockMemberService.addMember.mockReturnValue(of({}));
      component.email.set('new-dev@test.com');

      component.onAddMember();

      expect(mockMemberService.addMember).toHaveBeenCalledWith(123, 'new-dev@test.com', 'DEVELOPER', 50);
      expect(component.email()).toBe('');
    });

    it('devrait logguer une erreur si le requesterId est introuvable', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockAuthService.getCurrentMemberId.mockReturnValue(null);

      component.email.set('test@test.com');
      component.onAddMember();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Utilisateur non identifié'));
      expect(mockMemberService.addMember).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('devrait gérer l\'erreur 403 (droits insuffisants) via une alerte window', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
      mockAuthService.getCurrentMemberId.mockReturnValue(50);
      mockMemberService.addMember.mockReturnValue(throwError(() => ({ status: 403 })));

      component.email.set('admin@test.com');
      component.onAddMember();

      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("droits d'administrateur"));
      alertSpy.mockRestore();
    });
  });
});
