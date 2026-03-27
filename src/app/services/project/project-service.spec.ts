import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProjectService } from './project-service';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8081/api/projects';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait calculer le rôle ADMIN correctement (Logique Métier)', () => {
    const mockProject = {
      membres: [{ user: { id: 1 }, role: { libelle: 'ADMIN' } }]
    };
    const role = service.getUserRoleInProject(mockProject, 1);
    expect(role).toBe('ADMIN');
  });

  it('devrait appeler l API pour récupérer les projets (Requête HTTP)', () => {
    service.getProjectByUserId(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
