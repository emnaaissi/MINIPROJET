import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { InstrumentService } from '../services/instrument-service';
import { InstrumentCard } from './instrument-card';

@Component({
  selector: 'app-instrument-list',
  imports: [InstrumentCard],
  templateUrl: './instrument-list.html'
})
export class InstrumentList implements OnInit {
  private readonly instrumentService = inject(InstrumentService);
  instruments = this.instrumentService.instruments;

  nomRecherche = signal('');
  prixMax = signal('');

  resultats = computed(() => {
    const debutNom = this.nomRecherche().trim().toLowerCase();
    const max = Number(this.prixMax());
    return this.instruments().filter(i =>
      i.nom.toLowerCase().startsWith(debutNom) && (!max || i.prix <= max)
    );
  });

  ngOnInit(): void {
    this.instrumentService.getInstruments().subscribe();
  }

  onReset(nom: HTMLInputElement, prix: HTMLInputElement) {
    nom.value = '';
    prix.value = '';
    this.nomRecherche.set('');
    this.prixMax.set('');
  }
}
