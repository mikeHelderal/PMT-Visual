import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiLabel, TuiTextfield} from '@taiga-ui/core';
import {loginSuite} from './login.validation';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,
    TuiTextfield,
    TuiLabel,
    TuiButton,
    ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { email: '', password: '' };
  result = loginSuite.get();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.result = loginSuite.run(this.credentials);

    if (this.result.isValid()) {
      this.authService.login(this.credentials).subscribe({
        next: (user) => {
          console.log('Connecté !', user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          alert(`Bienvenue ${user.userName} !`);

          this.router.navigate(['/projects']);
        },
        error: (err : any) => {
          alert('Identifiants incorrects');
        }
      });
    }
  }
}
