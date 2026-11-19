import { Niveau } from './niveau';
import { Enseignant } from './enseignant';

export interface Instrument {
  id: string;
  nom: string;
  photo: string;
  prix: number;
  dateDebut: string;
  dureeCours: number;
  solfegeInclus: boolean;
  niveaux: Niveau[];
  enseignant: Enseignant[];
}
