import {Component, inject, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth';
import {registerSuite} from './register.validation';
import {TuiButton, TuiError, TuiLabel, TuiTextfield} from '@taiga-ui/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule,
    TuiTextfield,
    TuiLabel,
    TuiButton,
    TuiError,
    ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private router = inject(Router);

  user = {username: '',email: '', password: ''};
  result = signal(registerSuite.get());
  constructor(private authService: AuthService,) {}

  validate(field: string){
    registerSuite.run(this.user, field);
    this.result.set(registerSuite.get());
  }

  onSubmit(){
    this.result.set(registerSuite.run(this.user));

    if(this.result().isValid()){
      this.authService.register(this.user).subscribe({
        next: () =>{
          alert('Inscription réussie !');
          this.router.navigate(['/login']);
        },
        error: () => alert("Erreur lors de l'inscription")
      })
    }else {
      alert('Veuillez corriger les erreurs dans le formulaire.');
    }
  }



}
