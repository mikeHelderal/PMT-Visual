import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProjectMemberService } from './project-member';

describe('ProjectMemberService', () => {
  let service: ProjectMemberService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8081/api/members';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProjectMemberService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ProjectMemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait ajouter un membre avec les bons headers (POST)', () => {
    const projectId = 101;
    const email = 'test@example.com';
    const roleName = 'DEVELOPER';
    const requesterId = 50;

    service.addMember(projectId, email, roleName, requesterId).subscribe((res: any) => {
      expect(res).toBeDefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/addMember/${projectId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email, roleName });
    expect(req.request.headers.get('X-Member-ID')).toBe('50');

    req.flush({ message: 'Membre ajouté' });
  });

  it('devrait récupérer la liste des membres (GET)', () => {
    const projectId = 101;
    const mockMembers = [
      { id: 1, username: 'Alice', role: 'ADMIN' },
      { id: 2, username: 'Bob', role: 'MEMBER' }
    ];

    service.getMembers(projectId).subscribe((members: any[]) => {
      expect(members.length).toBe(2);
      expect(members[0].username).toBe('Alice');
    });

    const req = httpMock.expectOne(`${apiUrl}/project/${projectId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMembers);
  });

  it('devrait supprimer un membre (DELETE)', () => {
    const memberId = 1;
    const requesterId = 50;

    service.removeMember(memberId, requesterId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${memberId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('X-Member-ID')).toBe('50');

    req.flush(null);
  });
});
