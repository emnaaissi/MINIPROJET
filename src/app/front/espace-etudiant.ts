import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Instrument } from '../models/instrument';
import { EtudiantService } from '../services/etudiant-service';
import { InstrumentService } from '../services/instrument-service';
import { DureePipe } from '../pipes/duree-pipe';
import { SolfegeBadge } from '../shared/solfege-badge';
import { solfegeEffectif } from '../utils/solfege';

@Component({
  selector: 'app-espace-etudiant',
  imports: [RouterLink, DatePipe, DureePipe, SolfegeBadge],
  templateUrl: './espace-etudiant.html'
})
export class EspaceEtudiant implements OnInit {
  private readonly router = inject(Router);
  private readonly etudiantService = inject(EtudiantService);
  private readonly instrumentService = inject(InstrumentService);

  etudiant = this.etudiantService.etudiant;
  instruments = this.instrumentService.instruments;

  mesCours = computed(() => {
    const e = this.etudiant();
    if (!e) return [];
    return e.coursIds
      .map(id => this.instruments().find(i => i.id == id))
      .filter((i): i is Instrument => i !== undefined);
  });

  totalPrix = computed(() => this.mesCours().reduce((somme, i) => somme + i.prix, 0));

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

  solfege(i: Instrument): boolean {
    return solfegeEffectif(i, this.mesCours());
  }
}
