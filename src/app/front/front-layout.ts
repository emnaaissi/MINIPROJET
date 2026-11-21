import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from '../services/cart-service';
import { EtudiantService } from '../services/etudiant-service';

@Component({
  selector: 'app-front-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './front-layout.html'
})
export class FrontLayout {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);
  readonly etudiantService = inject(EtudiantService);

  onLogout() {
    this.etudiantService.logout();
    this.router.navigate(['/']);
  }
}
