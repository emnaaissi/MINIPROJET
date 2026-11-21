import { Component, computed, inject, OnInit } from '@angular/core';
import { EtudiantService } from '../services/etudiant-service';
import { InstrumentService } from '../services/instrument-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private readonly instrumentService = inject(InstrumentService);
  private readonly etudiantService = inject(EtudiantService);

  instruments = this.instrumentService.instruments;
  etudiants = this.etudiantService.etudiants;

  total = computed(() => this.instruments().length);

  nbEtudiants = computed(() => this.etudiants().length);

  prixMoyen = computed(() => {
    const n = this.total();
    return n == 0 ? 0 : this.instruments().reduce((s, i) => s + i.prix, 0) / n;
  });

  avecSolfege = computed(() => this.instruments().filter(i => i.solfegeInclus).length);

  plusCher = computed(() => [...this.instruments()].sort((a, b) => b.prix - a.prix)[0]);

  moinsCher = computed(() => [...this.instruments()].sort((a, b) => a.prix - b.prix)[0]);

  parNiveau = computed(() => {
    const compte: Record<string, number> = {};
    for (const i of this.instruments()) {
      for (const n of i.niveaux) {
        compte[n.nom] = (compte[n.nom] ?? 0) + 1;
      }
    }
    return Object.entries(compte).map(([nom, nb]) => ({ nom, nb }));
  });

  inscriptionsParCours = computed(() =>
    this.instruments()
      .map(i => ({
        nom: i.nom,
        nb: this.etudiants().filter(e => e.coursIds.includes(i.id)).length
      }))
      .sort((a, b) => b.nb - a.nb)
  );

  ngOnInit(): void {
    this.instrumentService.getInstruments().subscribe();
    this.etudiantService.getEtudiants().subscribe();
  }
}
