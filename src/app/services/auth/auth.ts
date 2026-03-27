import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProjectStateService} from '../project/project-state-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl: string = "http://localhost:8081/api/auth";
  private http = inject(HttpClient);

  private projectStateService: ProjectStateService = inject(ProjectStateService);

  currentUser = signal<any>(null);

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUser.set(user);
      this.projectStateService.setUserId(user.id);
    }
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(`${this.apiUrl}/login`, credentials, httpOptions).pipe(
      tap((response: any) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUser.set(response);

        if (response && response.id) {
          this.projectStateService.setUserId(response.id);
        }

      })
    );
  }

  getCurrentMemberId(): number | null {
    return this.currentUser()?.memberId || null;
  }


  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
  }

}
