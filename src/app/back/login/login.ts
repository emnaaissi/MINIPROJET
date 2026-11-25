import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, FormRoot, form, required } from '@angular/forms/signals';
import { AdminService } from '../../services/admin-service';

@Component({
  selector: 'app-login',
  imports: [FormRoot, FormField, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);

  readonly loginModel = signal({ nom: '', password: '' });
  readonly loginForm = form(this.loginModel, path => {
    required(path.nom, { message: "Le nom d'utilisateur est obligatoire" });
    required(path.password, { message: 'Le mot de passe est obligatoire' });
  });

  erreur = signal('');

  onSubmit() {
    const { nom, password } = this.loginModel();
    this.adminService.login(nom, password).subscribe({
      next: () => {
        if (this.adminService.isLoggedIn()) {
          this.router.navigate(['/admin']);
        } else {
          this.erreur.set('Nom ou mot de passe incorrect');
        }
      },
      error: () => this.erreur.set('Serveur injoignable : lancez json-server')
    });
  }
}
