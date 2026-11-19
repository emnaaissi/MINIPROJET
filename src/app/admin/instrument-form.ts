import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormField, FormRoot, applyEach, form, max, min, minLength, pattern, required
} from '@angular/forms/signals';
import { Instrument } from '../models/instrument';
import { InstrumentService } from '../services/instrument-service';

const modeleVide = (): Instrument => ({
  id: '',
  nom: '',
  photo: 'assets/images/',
  prix: 0,
  dateDebut: '',
  dureeCours: 60,
  solfegeInclus: false,
  niveaux: [{ id: 'n1', nom: '' }],
  enseignant: [{ nom: '', prenom: '', specialite: '' }]
});

const normaliser = (texte: string) => texte.trim().toLowerCase();

@Component({
  selector: 'app-instrument-form',
  imports: [FormRoot, FormField, RouterLink],
  templateUrl: './instrument-form.html'
})
export class InstrumentForm implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly instrumentService = inject(InstrumentService);

  modeEdition = signal(false);

  readonly instrumentModel = signal<Instrument>(modeleVide());

  readonly instrumentForm = form(this.instrumentModel, path => {
    required(path.nom, { message: 'Le nom est obligatoire' });
    minLength(path.nom, 2, { message: 'Au moins 2 caractères' });
    pattern(path.nom, /^[A-Z].+$/, { message: 'Le nom doit commencer par une majuscule' });

    required(path.photo, { message: 'La photo est obligatoire' });
    pattern(path.photo, /^.+\.(jpg|jpeg|png|webp)$/i, { message: 'Indiquez un fichier image (.jpg, .png, .webp)' });

    required(path.prix, { message: 'Le prix est obligatoire' });
    min(path.prix, 1, { message: 'Le prix doit être supérieur ou égal à 1 DT' });

    required(path.dateDebut, { message: 'La date de début est obligatoire' });

    required(path.dureeCours, { message: 'La durée est obligatoire' });
    min(path.dureeCours, 15, { message: 'Durée minimale : 15 minutes' });
    max(path.dureeCours, 180, { message: 'Durée maximale : 180 minutes' });

    applyEach(path.niveaux, niveau => {
      required(niveau.nom, { message: 'Le nom du niveau est obligatoire' });
      minLength(niveau.nom, 3, { message: 'Au moins 3 caractères' });
    });

    applyEach(path.enseignant, ens => {
      required(ens.nom, { message: 'Nom obligatoire' });
      required(ens.prenom, { message: 'Prénom obligatoire' });
      required(ens.specialite, { message: 'Spécialité obligatoire' });
    });
  });

  nomExiste = computed(() => {
    const nom = normaliser(this.instrumentModel().nom);
    const id = this.instrumentModel().id;
    return nom != '' && this.instrumentService.instruments().some(
      i => normaliser(i.nom) == nom && i.id != id
    );
  });

  ngOnInit(): void {
    this.instrumentService.getInstruments().subscribe();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.modeEdition.set(true);
      this.instrumentService.getInstrumentById(id).subscribe(
        instrument => this.instrumentModel.set(instrument)
      );
    }
  }

  onAddNiveau() {
    this.instrumentModel.update(i => ({
      ...i,
      niveaux: [...i.niveaux, { id: 'n' + (i.niveaux.length + 1), nom: '' }]
    }));
  }

  onRemoveNiveau(index: number) {
    this.instrumentModel.update(i => ({
      ...i,
      niveaux: i.niveaux.filter((_, k) => k != index)
    }));
  }

  onAddEnseignant() {
    this.instrumentModel.update(i => ({
      ...i,
      enseignant: [...i.enseignant, { nom: '', prenom: '', specialite: '' }]
    }));
  }

  onRemoveEnseignant(index: number) {
    this.instrumentModel.update(i => ({
      ...i,
      enseignant: i.enseignant.filter((_, k) => k != index)
    }));
  }

  onSubmit() {
    if (this.nomExiste()) return;
    const instrument = this.instrumentModel();
    const requete = this.modeEdition()
      ? this.instrumentService.updateInstrument(instrument)
      : this.instrumentService.addInstrument(instrument);
    requete.subscribe(() => this.router.navigate(['/admin/instruments']));
  }
}
