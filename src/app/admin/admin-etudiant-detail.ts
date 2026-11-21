import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Etudiant } from '../models/etudiant';
import { Instrument } from '../models/instrument';
import { EtudiantService } from '../services/etudiant-service';
import { InstrumentService } from '../services/instrument-service';
import { SolfegeBadge } from '../shared/solfege-badge';
import { solfegeEffectif } from '../utils/solfege';

@Component({
  selector: 'app-admin-etudiant-detail',
  imports: [RouterLink, DatePipe, SolfegeBadge],
  templateUrl: './admin-etudiant-detail.html'
})
export class AdminEtudiantDetail implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly etudiantService = inject(EtudiantService);
  private readonly instrumentService = inject(InstrumentService);

  instruments = this.instrumentService.instruments;
  etudiant = signal<Etudiant | undefined>(undefined);
  introuvable = signal(false);

  coursEtudiant = computed(() => {
    const e = this.etudiant();
    if (!e) return [];
    return e.coursIds
      .map(id => this.instruments().find(i => i.id == id))
      .filter((i): i is Instrument => i !== undefined);
  });

  coursDisponibles = computed(() => {
    const e = this.etudiant();
    return this.instruments().filter(i => !e?.coursIds.includes(i.id));
  });

  ngOnInit(): void {
    this.instrumentService.getInstruments().subscribe();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.etudiantService.getEtudiantById(id).subscribe({
        next: e => this.etudiant.set(e),
        error: () => this.introuvable.set(true)
      });
    }
  }

  solfege(i: Instrument): boolean {
    return solfegeEffectif(i, this.coursEtudiant());
  }

  onAdd(idCours: string) {
    const e = this.etudiant();
    if (!e || !idCours) return;
    this.etudiantService.modifierCours(e, [...e.coursIds, idCours]).subscribe(
      maj => this.etudiant.set(maj)
    );
  }

  onRemove(idCours: string) {
    const e = this.etudiant();
    if (!e) return;
    this.etudiantService.modifierCours(e, e.coursIds.filter(id => id != idCours)).subscribe(
      maj => this.etudiant.set(maj)
    );
  }
}
