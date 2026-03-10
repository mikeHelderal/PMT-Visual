import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth';
import {registerSuite} from './register.validation';
import {TuiButton, TuiError, TuiLabel, TuiTextfield} from '@taiga-ui/core';

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

  user = {username: '',email: '', password: ''};
  result: any = registerSuite.get();
  constructor(private authService: AuthService,) {}

  validate(field: string){
    registerSuite.run(this.user, field);
    this.result = registerSuite.get();
  }

  onSubmit(){
    this.result = registerSuite.run(this.user);

    if(this.result.isValid()){
      this.authService.register(this.user).subscribe({
        next: result => alert('Inscription réussie !'),
        error: result => alert("Erreur lors de l'inscription")
      })
    }else {
      alert('Veuillez corriger les erreurs dans le formulaire.');
    }
  }



}
