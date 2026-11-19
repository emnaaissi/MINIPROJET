import { Routes } from '@angular/router';
import { FrontLayout } from './front/front-layout';
import { InstrumentList } from './front/instrument-list';
import { InstrumentDetails } from './front/instrument-details';
import { Cart } from './front/cart';
import { About } from './front/about';
import { Login } from './admin/login';
import { AdminLayout } from './admin/admin-layout';
import { AdminList } from './admin/admin-list';
import { InstrumentForm } from './admin/instrument-form';
import { Dashboard } from './admin/dashboard';
import { AdminPassword } from './admin/admin-password';
import { NotFound } from './not-found';

export const routes: Routes = [
  { path: 'admin/login', title: 'Connexion administrateur', component: Login },
  {
    path: 'admin', component: AdminLayout,
    children: [
      { path: '', redirectTo: 'instruments', pathMatch: 'full' },
      { path: 'instruments', title: 'Gestion des cours', component: AdminList },
      { path: 'instruments/add', title: 'Ajouter un cours', component: InstrumentForm },
      { path: 'instruments/edit/:id', title: 'Modifier un cours', component: InstrumentForm },
      { path: 'dashboard', title: 'Tableau de bord', component: Dashboard },
      { path: 'password', title: 'Changer le mot de passe', component: AdminPassword }
    ]
  },
  {
    path: '', component: FrontLayout,
    children: [
      { path: '', redirectTo: 'instruments', pathMatch: 'full' },
      { path: 'instruments', title: 'Nos cours', component: InstrumentList },
      { path: 'instruments/:id', title: 'Détail du cours', component: InstrumentDetails },
      { path: 'panier', title: 'Mon panier', component: Cart },
      { path: 'a-propos', title: 'À propos', component: About }
    ]
  },
  { path: '**', title: 'Erreur', component: NotFound }
];
