import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl: string = "http://localhost:8081/api/auth";
  private http = inject(HttpClient);



  register(user: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, user)
  }

  login(credentials: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, credentials)
  }

}
