import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Instrument } from '../../models/instrument';
import { Seance } from '../../models/seance';
import { EtudiantService } from '../../services/etudiant-service';
import { InstrumentService } from '../../services/instrument-service';
import { DureePipe } from '../../pipes/duree-pipe';
import { JourPipe } from '../../pipes/jour-pipe';
import { PRIX_SOLFEGE } from '../../config';

@Component({
  selector: 'app-espace-etudiant',
  imports: [RouterLink, DatePipe, DureePipe, JourPipe],
  templateUrl: './espace-etudiant.html'
})
export class EspaceEtudiant implements OnInit {
  private readonly router = inject(Router);
  private readonly etudiantService = inject(EtudiantService);
  private readonly instrumentService = inject(InstrumentService);

  etudiant = this.etudiantService.etudiant;
  instruments = this.instrumentService.instruments;
  aujourdhui = new Date().toISOString().slice(0, 10);

  mesInstruments = computed(() => {
    const e = this.etudiant();
    if (!e) return [];
    return e.instrumentIds
      .map(id => this.instruments().find(i => i.id == id))
      .filter((i): i is Instrument => i !== undefined);
  });

  planning = computed(() => {
    const e = this.etudiant();
    if (!e) return [];
    return [...e.seances]
      .sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure))
      .map(s => ({ seance: s, libelle: this.libelle(s), passee: s.date < this.aujourdhui }));
  });

  mensualite = computed(() => {
    const e = this.etudiant();
    const instruments = this.mesInstruments().reduce((somme, i) => somme + i.prix, 0);
    return instruments + (e?.solfege ? PRIX_SOLFEGE : 0);
  });

  prochaines = computed(() => this.planning().filter(p => !p.passee).length);

  ngOnInit(): void {
    const e = this.etudiant();
    if (!e) {
      this.router.navigate(['/etudiant/login']);
      return;
    }
    this.instrumentService.getInstruments().subscribe();
    this.etudiantService.rafraichir(e.id).subscribe({
      error: () => {
        this.etudiantService.logout();
        this.router.navigate(['/etudiant/login']);
      }
    });
  }

  libelle(s: Seance): string {
    if (s.type == 'solfege') return 'Solfège';
    return this.instruments().find(i => i.id == s.instrumentId)?.nom ?? 'Cours';
  }
}
