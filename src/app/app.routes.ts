import { Routes } from '@angular/router';
import { Home } from './front/home/home';
import { FrontLayout } from './front/front-layout/front-layout';
import { InstrumentList } from './front/instrument-list/instrument-list';
import { InstrumentDetails } from './front/instrument-details/instrument-details';
import { Cart } from './front/cart/cart';
import { EtudiantLogin } from './front/etudiant-login/etudiant-login';
import { EspaceEtudiant } from './front/espace-etudiant/espace-etudiant';
import { About } from './front/about/about';
import { NotFound } from './front/not-found/not-found';
import { Login } from './back/login/login';
import { AdminLayout } from './back/admin-layout/admin-layout';
import { AdminList } from './back/admin-list/admin-list';
import { InstrumentForm } from './back/instrument-form/instrument-form';
import { Dashboard } from './back/dashboard/dashboard';
import { AdminPassword } from './back/admin-password/admin-password';
import { AdminEtudiants } from './back/admin-etudiants/admin-etudiants';
import { AdminEtudiantDetail } from './back/admin-etudiant-detail/admin-etudiant-detail';

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
      { path: 'etudiants/:id', title: "Planning de l'étudiant", component: AdminEtudiantDetail },
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
      {
        path: 'inscription', title: 'Inscription',
        loadComponent: () => import('./front/inscription-form/inscription-form').then(m => m.InscriptionForm)
      },
      { path: 'etudiant/login', title: 'Connexion étudiant', component: EtudiantLogin },
      { path: 'etudiant', title: 'Mon espace', component: EspaceEtudiant },
      { path: 'a-propos', title: 'À propos', component: About }
    ]
  },
  { path: '**', title: 'Erreur', component: NotFound }
];
