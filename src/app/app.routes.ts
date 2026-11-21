import { Routes } from '@angular/router';
import { Home } from './front/home';
import { FrontLayout } from './front/front-layout';
import { InstrumentList } from './front/instrument-list';
import { InstrumentDetails } from './front/instrument-details';
import { Cart } from './front/cart';
import { InscriptionForm } from './front/inscription-form';
import { EtudiantLogin } from './front/etudiant-login';
import { EspaceEtudiant } from './front/espace-etudiant';
import { About } from './front/about';
import { Login } from './admin/login';
import { AdminLayout } from './admin/admin-layout';
import { AdminList } from './admin/admin-list';
import { InstrumentForm } from './admin/instrument-form';
import { Dashboard } from './admin/dashboard';
import { AdminPassword } from './admin/admin-password';
import { AdminEtudiants } from './admin/admin-etudiants';
import { AdminEtudiantDetail } from './admin/admin-etudiant-detail';
import { NotFound } from './not-found';

export const routes: Routes = [
  { path: '', pathMatch: 'full', title: '5 SOL - École de musique', component: Home },
  { path: 'admin/login', title: 'Connexion administrateur', component: Login },
  {
    path: 'admin', component: AdminLayout,
    children: [
      { path: '', redirectTo: 'instruments', pathMatch: 'full' },
      { path: 'instruments', title: 'Gestion des cours', component: AdminList },
      { path: 'instruments/add', title: 'Ajouter un cours', component: InstrumentForm },
      { path: 'instruments/edit/:id', title: 'Modifier un cours', component: InstrumentForm },
      { path: 'etudiants', title: 'Étudiants', component: AdminEtudiants },
      { path: 'etudiants/:id', title: "Cours de l'étudiant", component: AdminEtudiantDetail },
      { path: 'dashboard', title: 'Tableau de bord', component: Dashboard },
      { path: 'password', title: 'Changer le mot de passe', component: AdminPassword }
    ]
  },
  {
    path: '', component: FrontLayout,
    children: [
      { path: 'instruments', title: 'Nos cours', component: InstrumentList },
      { path: 'instruments/:id', title: 'Détail du cours', component: InstrumentDetails },
      { path: 'panier', title: 'Mon panier', component: Cart },
      { path: 'inscription', title: 'Inscription', component: InscriptionForm },
      { path: 'etudiant/login', title: 'Connexion étudiant', component: EtudiantLogin },
      { path: 'etudiant', title: 'Mon espace', component: EspaceEtudiant },
      { path: 'a-propos', title: 'À propos', component: About }
    ]
  },
  { path: '**', title: 'Erreur', component: NotFound }
];
