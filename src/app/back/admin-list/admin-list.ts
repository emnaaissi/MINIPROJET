import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Instrument } from '../../models/instrument';
import { InstrumentService } from '../../services/instrument-service';
import { DureePipe } from '../../pipes/duree-pipe';

@Component({
  selector: 'app-admin-list',
  imports: [RouterLink, DatePipe, DureePipe],
  templateUrl: './admin-list.html'
})
export class AdminList implements OnInit {
  private readonly instrumentService = inject(InstrumentService);
  instruments = this.instrumentService.instruments;

  recherche = signal('');
  resultats = computed(() => {
    const texte = this.recherche().trim().toLowerCase();
    return this.instruments().filter(i => i.nom.toLowerCase().includes(texte));
  });

  ngOnInit(): void {
    this.instrumentService.getInstruments().subscribe();
  }

  aSupprimer = signal<Instrument | undefined>(undefined);

  onDelete(i: Instrument) {
    this.aSupprimer.set(i);
  }

  onConfirmDelete() {
    const i = this.aSupprimer();
    if (i) {
      this.instrumentService.deleteInstrument(i.id).subscribe();
    }
    this.aSupprimer.set(undefined);
  }

  onCancelDelete() {
    this.aSupprimer.set(undefined);
  }
}