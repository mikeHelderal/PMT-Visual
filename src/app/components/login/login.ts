import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiButton, TuiLabel, TuiTextfield} from '@taiga-ui/core';
import {loginSuite} from './login.validation';
import {AuthService} from '../../services/auth/auth';
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
  private router = inject(Router)
  credentials = { email: '', password: '' };
  result = loginSuite.get();

  constructor(
    private authService: AuthService
  ) {}

  onLogin() {
    this.result = loginSuite.run(this.credentials);

    if (this.result.isValid()) {
      this.authService.login(this.credentials).subscribe({
        next: (user) => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.router.navigate(['/projects']);
        },
        error: () => {
          alert('Identifiants incorrects');
        }
      });
    }
  }
}
