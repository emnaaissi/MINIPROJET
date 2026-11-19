import { Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, minLength, required } from '@angular/forms/signals';
import { AdminService } from '../services/admin-service';

@Component({
  selector: 'app-admin-password',
  imports: [FormRoot, FormField],
  templateUrl: './admin-password.html'
})
export class AdminPassword {
  private readonly adminService = inject(AdminService);

  readonly passwordModel = signal({ ancien: '', nouveau: '', confirmation: '' });
  readonly passwordForm = form(this.passwordModel, path => {
    required(path.ancien, { message: "L'ancien mot de passe est obligatoire" });
    required(path.nouveau, { message: 'Le nouveau mot de passe est obligatoire' });
    minLength(path.nouveau, 6, { message: 'Au moins 6 caractères' });
    required(path.confirmation, { message: 'La confirmation est obligatoire' });
  });

  message = signal('');
  succes = signal(false);

  onSubmit() {
    const admin = this.adminService.admin();
    const saisie = this.passwordModel();
    if (!admin) return;

    if (saisie.ancien != admin.password) {
      this.afficher("L'ancien mot de passe est incorrect", false);
    } else if (saisie.nouveau != saisie.confirmation) {
      this.afficher('La confirmation ne correspond pas au nouveau mot de passe', false);
    } else {
      this.adminService.changePassword(admin, saisie.nouveau).subscribe({
        next: () => {
          this.afficher('Mot de passe modifié avec succès', true);
          this.passwordModel.set({ ancien: '', nouveau: '', confirmation: '' });
        },
        error: () => this.afficher('Erreur : serveur injoignable', false)
      });
    }
  }

  private afficher(texte: string, ok: boolean) {
    this.message.set(texte);
    this.succes.set(ok);
  }
}
