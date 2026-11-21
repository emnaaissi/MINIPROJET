import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Instrument } from '../models/instrument';
import { CartService } from '../services/cart-service';
import { SolfegeBadge } from '../shared/solfege-badge';
import { solfegeEffectif } from '../utils/solfege';

@Component({
  selector: 'app-instrument-card',
  imports: [RouterLink, SolfegeBadge],
  templateUrl: './instrument-card.html'
})
export class InstrumentCard {
  private readonly cartService = inject(CartService);

  instrument = input.required<Instrument>();

  solfegeInclus = computed(() =>
    solfegeEffectif(this.instrument(), this.cartService.items())
  );
}
