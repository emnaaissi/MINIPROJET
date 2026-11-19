import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Admin } from '../models/admin';
import { API_URL } from '../config';

const URL = `${API_URL}/admins`;
const CLE_SESSION = 'admin-connecte';

@Service()
export class AdminService {
  private readonly _http = inject(HttpClient);
  private readonly _admin = signal<Admin | undefined>(this.lireSession());
  admin = this._admin.asReadonly();
  isLoggedIn = computed(() => this._admin() !== undefined);

  login(nom: string, password: string): Observable<Admin[]> {
    return this._http.get<Admin[]>(URL, { params: { nom, password } }).pipe(
      tap(admins => this.enregistrer(admins.length > 0 ? admins[0] : undefined))
    );
  }

  logout() {
    this.enregistrer(undefined);
  }

  changePassword(admin: Admin, nouveauMotDePasse: string): Observable<Admin> {
    const modifie = { ...admin, password: nouveauMotDePasse };
    return this._http.put<Admin>(`${URL}/${admin.id}`, modifie).pipe(
      tap(a => this.enregistrer(a))
    );
  }

  private enregistrer(admin: Admin | undefined) {
    this._admin.set(admin);
    if (typeof sessionStorage === 'undefined') return;
    if (admin) {
      sessionStorage.setItem(CLE_SESSION, JSON.stringify(admin));
    } else {
      sessionStorage.removeItem(CLE_SESSION);
    }
  }

  private lireSession(): Admin | undefined {
    if (typeof sessionStorage === 'undefined') return undefined;
    const brut = sessionStorage.getItem(CLE_SESSION);
    return brut ? JSON.parse(brut) : undefined;
  }
}
