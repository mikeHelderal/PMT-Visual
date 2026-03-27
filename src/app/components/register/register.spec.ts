import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../../services/auth/auth';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let router: Router;

  const mockAuthService = {
    register: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    fixture.detectChanges();
  });

  describe('Validation (Vest Suite)', () => {
    it('devrait être valide quand toutes les conditions sont remplies', () => {
      mockAuthService.register.mockReturnValue(of({}));

      component.user = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      component.onSubmit();

      expect(component.result().isValid()).toBe(true);
      expect(mockAuthService.register).toHaveBeenCalled();
    });
  });

  describe('onSubmit()', () => {
    it('ne devrait pas appeler le service si le formulaire est invalide', () => {
      component.user = { username: 'te', email: 'invalid', password: '' };

      component.onSubmit();

      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('devrait naviguer vers login après une inscription réussie', () => {
      mockAuthService.register.mockReturnValue(of({}));
      component.user = { username: 'testuser', email: 'test@example.com', password: 'password123' };

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith('Inscription réussie !');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('devrait afficher une alerte en cas d\'erreur serveur', () => {
      mockAuthService.register.mockReturnValue(throwError(() => new Error('Server Error')));
      component.user = { username: 'testuser', email: 'test@example.com', password: 'password123' };

      component.onSubmit();

      expect(window.alert).toHaveBeenCalledWith("Erreur lors de l'inscription");
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
