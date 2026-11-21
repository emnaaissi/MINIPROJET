import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, FormRoot, email, form, required } from '@angular/forms/signals';
import { CartService } from '../services/cart-service';
import { EtudiantService } from '../services/etudiant-service';

@Component({
  selector: 'app-etudiant-login',
  imports: [FormRoot, FormField, RouterLink],
  templateUrl: './etudiant-login.html'
})
export class EtudiantLogin {
  private readonly router = inject(Router);
  private readonly etudiantService = inject(EtudiantService);
  private readonly cartService = inject(CartService);

  readonly loginModel = signal({ email: '', password: '' });
  readonly loginForm = form(this.loginModel, path => {
    required(path.email, { message: "L'email est obligatoire" });
    email(path.email, { message: 'Adresse email invalide' });
    required(path.password, { message: 'Le mot de passe est obligatoire' });
  });

  erreur = signal('');

  onSubmit() {
    const saisie = this.loginModel();
    this.etudiantService.login(saisie.email.trim().toLowerCase(), saisie.password).subscribe({
      next: () => {
        if (!this.etudiantService.isLoggedIn()) {
          this.erreur.set('Email ou mot de passe incorrect');
        } else if (this.cartService.count() > 0) {
          this.router.navigate(['/panier']);
        } else {
          this.router.navigate(['/etudiant']);
        }
      },
      error: () => this.erreur.set('Serveur injoignable : lancez json-server')
    });
  }
}
