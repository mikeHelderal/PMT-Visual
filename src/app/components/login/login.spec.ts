import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { AuthService } from '../../services/auth/auth';
import { TuiButton, TuiLabel, TuiTextfield } from '@taiga-ui/core';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockAuthService = {
    login: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Login,
        FormsModule,
        TuiTextfield,
        TuiLabel,
        TuiButton
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('ne devrait pas appeler AuthService.login si le formulaire est invalide (Vest)', () => {
    component.onLogin();

    expect(mockAuthService.login).not.toHaveBeenCalled();
    expect(component.result.isValid()).toBe(false);
  });

  it('devrait appeler AuthService.login et rediriger en cas de succès', () => {
    component.credentials = { email: 'test@test.com', password: 'password123' };

    const mockUser = { id: 1, email: 'test@test.com', token: 'fake-jwt' };
    mockAuthService.login.mockReturnValue(of(mockUser));

    const storageSpy = jest.spyOn(Storage.prototype, 'setItem');

    component.onLogin();

    expect(mockAuthService.login).toHaveBeenCalledWith(component.credentials);
    expect(storageSpy).toHaveBeenCalledWith('currentUser', JSON.stringify(mockUser));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/projects']);
  });

  it('devrait afficher une alerte en cas d\'erreur d\'identifiants', () => {
    component.credentials = { email: 'wrong@test.com', password: 'wrongpassword' };

    mockAuthService.login.mockReturnValue(throwError(() => new Error('Unauthorized')));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onLogin();

    expect(alertSpy).toHaveBeenCalledWith('Identifiants incorrects');
  });
});
