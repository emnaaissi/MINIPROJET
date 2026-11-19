import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CartService } from '../services/cart-service';

@Component({
  selector: 'app-front-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './front-layout.html'
})
export class FrontLayout {
  readonly cartService = inject(CartService);
}
