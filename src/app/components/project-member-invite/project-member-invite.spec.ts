import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectMemberInvite } from './project-member-invite';
import { ProjectMemberService } from '../../services/projectMember/project-member';
import { AuthService } from '../../services/auth/auth';
import { TuiDialogService } from '@taiga-ui/core';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { INVITE_SUITE } from './project-member-validation';

describe('ProjectMemberInvite', () => {
  let component: ProjectMemberInvite;
  let fixture: ComponentFixture<ProjectMemberInvite>;

  const mockMemberService = {
    addMember: jest.fn()
  };
  const mockAuthService = {
    getCurrentMemberId: jest.fn()
  };
  const mockDialogService = {
    open: jest.fn().mockReturnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMemberInvite, FormsModule],
      providers: [
        { provide: ProjectMemberService, useValue: mockMemberService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TuiDialogService, useValue: mockDialogService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMemberInvite);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('projectId', 101);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait valider l\'email lors de la saisie (onInput)', () => {
    component.form.email = 'invalide-email';
    component.onInput('email');

    expect(component.result().hasErrors('email')).toBe(true);
    expect(component.getError('email')).toBe("Format d'email invalide");
  });

  it('devrait ouvrir le dialogue d\'ajout de membre', () => {
    const templateRef = {} as any;
    component.openAddMemberDialog(templateRef);

    expect(mockDialogService.open).toHaveBeenCalledWith(templateRef, expect.objectContaining({
      label: 'Nouveau membre'
    }));
  });

  describe('submit()', () => {
    it('ne devrait pas appeler le service si le formulaire est invalide', () => {
      component.form.email = '';
      component.submit();

      expect(mockMemberService.addMember).not.toHaveBeenCalled();
    });

    it('devrait afficher une erreur si l\'ID du demandeur est introuvable', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      component.form = { email: 'test@test.fr', roleName: 'MEMBER' };
      mockAuthService.getCurrentMemberId.mockReturnValue(null);

      component.submit();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Utilisateur non identifié"));
      expect(mockMemberService.addMember).not.toHaveBeenCalled();
    });

    it('devrait inviter le membre avec succès et émettre l\'output', () => {
      component.form = { email: 'new@member.com', roleName: 'ADMIN' };
      mockAuthService.getCurrentMemberId.mockReturnValue(99);
      mockMemberService.addMember.mockReturnValue(of({}));

      const emitSpy = jest.spyOn(component.memberAdded, 'emit');

      component.submit();

      expect(component.isLoading()).toBe(false);
      expect(mockMemberService.addMember).toHaveBeenCalledWith(101, 'new@member.com', 'ADMIN', 99);
      expect(emitSpy).toHaveBeenCalled();
      expect(component.form.email).toBe('');
    });

    it('devrait gérer l\'erreur 403 (droits insuffisants)', () => {
      component.form = { email: 'admin@test.com', roleName: 'ADMIN' };
      mockAuthService.getCurrentMemberId.mockReturnValue(99);
      mockMemberService.addMember.mockReturnValue(throwError(() => ({ status: 403 })));

      const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

      component.submit();

      expect(component.isLoading()).toBe(false);
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Vous n'avez pas les droits d'administrateur"));
    });
  });
});
