import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';
import { ProjectStateService } from '../project/project-state-service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let projectStateService: ProjectStateService;
  const apiUrl = 'http://localhost:8081/api/auth';

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        ProjectStateService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    projectStateService = TestBed.inject(ProjectStateService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait initialiser currentUser si des données existent dans le localStorage', () => {
    const mockUser = { id: 1, nom: 'Alice' };

    TestBed.resetTestingModule();

    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        ProjectStateService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    const newService = TestBed.inject(AuthService);
    expect(newService.currentUser()).toEqual(mockUser);
  });
  it('devrait nettoyer le state lors du logout', () => {
    service.currentUser.set({ id: 1 });
    localStorage.setItem('currentUser', JSON.stringify({ id: 1 }));
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    service.logout();

    expect(service.currentUser()).toBeNull();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('devrait gérer le login et synchroniser le ProjectStateService', () => {
    const credentials = { email: 'test@test.com', password: '123' };
    const mockResponse = { id: 42, nom: 'Alice', email: 'test@test.com' };

    const spyState = jest.spyOn(projectStateService, 'setUserId');

    service.login(credentials).subscribe((response: any) => {
      expect(response).toEqual(mockResponse);
      expect(service.currentUser()).toEqual(mockResponse);
      expect(localStorage.getItem('currentUser')).toContain('42');
      expect(spyState).toHaveBeenCalledWith(42);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('devrait retourner le memberId via getCurrentMemberId', () => {
    service.currentUser.set({ id: 1, memberId: 100 });
    expect(service.getCurrentMemberId()).toBe(100);
  });

  it('devrait retourner null pour getCurrentMemberId si aucun utilisateur', () => {
    service.currentUser.set(null);
    expect(service.getCurrentMemberId()).toBeNull();
  });
});
