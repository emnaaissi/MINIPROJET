import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { EtudiantService } from '../../services/etudiant-service';
import { InscriptionForm } from '../inscription-form/inscription-form';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, InscriptionForm],
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

  onRemove(id: string) {
    this.cartService.remove(id);
  }

  onSolfege(choix: boolean) {
    this.cartService.setSolfege(choix);
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
          .filter(id => !etudiant.instrumentIds.includes(id));

        this.etudiantService.modifier({
          ...etudiant,
          instrumentIds: [...etudiant.instrumentIds, ...nouveaux],
          solfege: etudiant.solfege || this.cartService.solfege()
        }).subscribe({
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
