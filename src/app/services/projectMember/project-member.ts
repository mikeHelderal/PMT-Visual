import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectMemberService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8081/api/members';

  addMember(projectId: number, email: string, roleName: string, requesterId: number): Observable<any> {
    const headers = new HttpHeaders().set('X-Member-ID', requesterId.toString());
    return this.http.post(`${this.apiUrl}/addMember/${projectId}`, {
      email,
      roleName,
    },{headers});
  }


  getMembers(projectId: number): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}/project/${projectId}`);
  }

  removeMember(memberId: number, requesterId: number): Observable<void> {
    const headers = new HttpHeaders().set('X-Member-ID', requesterId.toString());
    return this.http.delete<void>(`${this.apiUrl}/${memberId}`,{headers});
  }
}
