import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart-service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html'
})
export class Cart {
  readonly cartService = inject(CartService);
  items = this.cartService.items;
  total = this.cartService.total;
  commandeValidee = signal(false);

  onRemove(id: string) {
    this.cartService.remove(id);
  }

  onValidate() {
    this.cartService.clear();
    this.commandeValidee.set(true);
  }
}
