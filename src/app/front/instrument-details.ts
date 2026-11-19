import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Instrument } from '../models/instrument';
import { InstrumentService } from '../services/instrument-service';
import { CartService } from '../services/cart-service';
import { DureePipe } from '../pipes/duree-pipe';

@Component({
  selector: 'app-instrument-details',
  imports: [DatePipe, DureePipe],
  templateUrl: './instrument-details.html'
})
export class InstrumentDetails implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly instrumentService = inject(InstrumentService);
  readonly cartService = inject(CartService);

  instrument = signal<Instrument | undefined>(undefined);
  introuvable = signal(false);

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.instrumentService.getInstrumentById(id).subscribe({
        next: i => this.instrument.set(i),
        error: () => this.introuvable.set(true)
      });
    }
  }

  onAddToCart(i: Instrument) {
    this.cartService.add(i);
  }

  onBack() {
    this.router.navigate(['/instruments']);
  }
}
