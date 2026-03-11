import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081/api/members';

  addMember(projectId: number, email: string, roleName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/addMember/${projectId}`, {
      email,
      roleName,
    });
  }


  getMembers(projectId: number): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/project/${projectId}`);
  }

  removeMember(memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${memberId}`);
  }
}
