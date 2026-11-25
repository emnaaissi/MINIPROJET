import { Seance } from './seance';

export interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  instrumentIds: string[];
  solfege: boolean;
  seances: Seance[];
  dateInscription: string;
}
