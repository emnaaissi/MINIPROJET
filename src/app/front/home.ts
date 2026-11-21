import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html'
})
export class Home {
  notes = [
    { symbole: '♪', gauche: 6, taille: 2.2, delai: 0, duree: 13 },
    { symbole: '♫', gauche: 16, taille: 3, delai: 4, duree: 16 },
    { symbole: '♩', gauche: 27, taille: 1.8, delai: 8, duree: 12 },
    { symbole: '♬', gauche: 38, taille: 2.6, delai: 2, duree: 15 },
    { symbole: '♪', gauche: 52, taille: 2, delai: 6, duree: 14 },
    { symbole: '♫', gauche: 63, taille: 3.2, delai: 1, duree: 17 },
    { symbole: '♩', gauche: 74, taille: 2.4, delai: 9, duree: 13 },
    { symbole: '♬', gauche: 85, taille: 1.9, delai: 5, duree: 15 },
    { symbole: '♪', gauche: 94, taille: 2.8, delai: 3, duree: 18 }
  ];

  instruments = [
    { nom: 'Piano', icone: '🎹' },
    { nom: 'Guitare', icone: '🎸' },
    { nom: 'Violon', icone: '🎻' },
    { nom: 'Oud', icone: '🪕' },
    { nom: 'Batterie', icone: '🥁' },
    { nom: 'Chant', icone: '🎤' }
  ];

  avantages = [
    { icone: '🎓', titre: 'Enseignants passionnés', texte: "Des musiciens expérimentés qui s'adaptent à votre rythme et à vos envies." },
    { icone: '📈', titre: 'Tous les niveaux', texte: 'Débutant, intermédiaire ou avancé : chaque cours propose plusieurs niveaux.' },
    { icone: '🎼', titre: 'Solfège inclus une fois', texte: 'Avec plusieurs instruments, le solfège est suivi une seule fois et reste non inclus ensuite.' }
  ];

  etapes = [
    { numero: '01', titre: 'Choisissez vos cours', texte: 'Parcourez le catalogue et ajoutez vos instruments au panier.' },
    { numero: '02', titre: 'Inscrivez-vous', texte: 'Remplissez le formulaire : votre compte étudiant est créé.' },
    { numero: '03', titre: 'Retrouvez vos cours', texte: 'Connectez-vous à votre espace étudiant à tout moment.' }
  ];
}
