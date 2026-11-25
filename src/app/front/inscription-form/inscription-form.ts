import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormField, FormRoot, email, form, minLength, pattern, required } from '@angular/forms/signals';
import { CartService } from '../../services/cart-service';
import { EtudiantService } from '../../services/etudiant-service';

@Component({
  selector: 'app-inscription-form',
  imports: [FormRoot, FormField, RouterLink],
  templateUrl: './inscription-form.html'
})
export class InscriptionForm {
  private readonly router = inject(Router);
  private readonly etudiantService = inject(EtudiantService);
  readonly cartService = inject(CartService);

  readonly inscriptionModel = signal({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmation: ''
  });

  readonly inscriptionForm = form(this.inscriptionModel, path => {
    required(path.nom, { message: 'Le nom est obligatoire' });
    minLength(path.nom, 2, { message: 'Au moins 2 caractères' });
    required(path.prenom, { message: 'Le prénom est obligatoire' });
    minLength(path.prenom, 2, { message: 'Au moins 2 caractères' });
    required(path.email, { message: "L'email est obligatoire" });
    email(path.email, { message: 'Adresse email invalide' });
    required(path.telephone, { message: 'Le téléphone est obligatoire' });
    pattern(path.telephone, /^[0-9]{8}$/, { message: 'Le téléphone doit contenir 8 chiffres' });
    required(path.password, { message: 'Le mot de passe est obligatoire' });
    minLength(path.password, 6, { message: 'Au moins 6 caractères' });
    required(path.confirmation, { message: 'La confirmation est obligatoire' });
  });

  erreur = signal('');

  onSubmit() {
    const saisie = this.inscriptionModel();
    const adresse = saisie.email.trim().toLowerCase();

    if (saisie.password != saisie.confirmation) {
      this.erreur.set('La confirmation ne correspond pas au mot de passe');
      return;
    }

    this.etudiantService.emailExiste(adresse).subscribe({
      next: trouves => {
        if (trouves.length > 0) {
          this.erreur.set('Un compte existe déjà avec cet email');
          return;
        }

        this.etudiantService.inscrire({
          nom: saisie.nom.trim(),
          prenom: saisie.prenom.trim(),
          email: adresse,
          telephone: saisie.telephone,
          password: saisie.password,
          instrumentIds: this.cartService.items().map(i => i.id),
          solfege: this.cartService.solfege(),
          seances: [],
          dateInscription: new Date().toISOString().slice(0, 10)
        }).subscribe({
          next: () => {
            this.cartService.clear();
            this.router.navigate(['/etudiant']);
          },
          error: () => this.erreur.set('Erreur : serveur injoignable')
        });
      },
      error: () => this.erreur.set('Erreur : serveur injoignable, lancez json-server')
    });
  }
}
