import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl: string = "http://localhost:8081/api/auth";
  private http = inject(HttpClient);

  currentUser = signal<any>(JSON.parse(localStorage.getItem('user') || 'null'));

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('user', JSON.stringify(response));
        this.currentUser.set(response);
      })
    );
  }

  getCurrentMemberId(): number | null {
    return this.currentUser()?.memberId || null;
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'ADMIN';
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

}
