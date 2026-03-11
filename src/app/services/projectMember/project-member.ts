import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/members';

  addMember(projectId: number, email: string, roleName: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('role', roleName);

    return this.http.post(`${this.apiUrl}/${projectId}/invite`, {}, { params });  }

  getMembers(projectId: number): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/${projectId}`);
  }

  removeMember(memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${memberId}`);
  }
}
