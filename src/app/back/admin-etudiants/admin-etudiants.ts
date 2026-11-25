import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Etudiant } from '../../models/etudiant';
import { EtudiantService } from '../../services/etudiant-service';

@Component({
  selector: 'app-admin-etudiants',
  imports: [RouterLink, DatePipe],
  templateUrl: './admin-etudiants.html'
})
export class AdminEtudiants implements OnInit {
  private readonly etudiantService = inject(EtudiantService);
  etudiants = this.etudiantService.etudiants;

  recherche = signal('');
  resultats = computed(() => {
    const texte = this.recherche().trim().toLowerCase();
    return this.etudiants().filter(e =>
      `${e.prenom} ${e.nom} ${e.email}`.toLowerCase().includes(texte)
    );
  });

  ngOnInit(): void {
    this.etudiantService.getEtudiants().subscribe();
  }

  aSupprimer = signal<Etudiant | undefined>(undefined);

  onDelete(e: Etudiant) {
    this.aSupprimer.set(e);
  }

  onConfirmDelete() {
    const e = this.aSupprimer();
    if (e) {
      this.etudiantService.supprimer(e.id).subscribe();
    }
    this.aSupprimer.set(undefined);
  }

  onCancelDelete() {
    this.aSupprimer.set(undefined);
  }
}