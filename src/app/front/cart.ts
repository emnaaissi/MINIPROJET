import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Instrument } from '../models/instrument';
import { CartService } from '../services/cart-service';
import { EtudiantService } from '../services/etudiant-service';
import { SolfegeBadge } from '../shared/solfege-badge';
import { solfegeEffectif } from '../utils/solfege';
import { InscriptionForm } from './inscription-form';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, SolfegeBadge, InscriptionForm],
  templateUrl: './cart.html'
})
export class Cart {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  readonly etudiantService = inject(EtudiantService);

  items = this.cartService.items;
  total = this.cartService.total;

  formulaireVisible = signal(false);
  erreur = signal('');

  solfege(i: Instrument): boolean {
    return solfegeEffectif(i, this.items());
  }

  aSolfegeNonInclus(): boolean {
    return this.items().some(i => i.solfegeInclus && !this.solfege(i));
  }

  onRemove(id: string) {
    this.cartService.remove(id);
  }

  onShowForm() {
    this.formulaireVisible.set(true);
  }

  onConfirm() {
    const connecte = this.etudiantService.etudiant();
    if (!connecte) return;

    this.etudiantService.rafraichir(connecte.id).subscribe({
      next: etudiant => {
        const nouveaux = this.items()
          .map(i => i.id)
          .filter(id => !etudiant.coursIds.includes(id));

        this.etudiantService.modifierCours(etudiant, [...etudiant.coursIds, ...nouveaux]).subscribe({
          next: () => {
            this.cartService.clear();
            this.router.navigate(['/etudiant']);
          },
          error: () => this.erreur.set('Erreur : serveur injoignable')
        });
      },
      error: () => this.erreur.set('Erreur : serveur injoignable')
    });
  }
}
