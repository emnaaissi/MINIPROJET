import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Etudiant } from '../models/etudiant';
import { API_URL } from '../config';

const URL = `${API_URL}/etudiants`;
const CLE_SESSION = 'etudiant-connecte';

@Service()
export class EtudiantService {
  private readonly _http = inject(HttpClient);
  private readonly _etudiants = signal<Etudiant[]>([]);
  private readonly _etudiant = signal<Etudiant | undefined>(this.lireSession());

  etudiants = this._etudiants.asReadonly();
  etudiant = this._etudiant.asReadonly();
  isLoggedIn = computed(() => this._etudiant() !== undefined);

  getEtudiants(): Observable<Etudiant[]> {
    return this._http.get<Etudiant[]>(URL).pipe(
      tap(all => this._etudiants.set(all))
    );
  }

  getEtudiantById(id: string): Observable<Etudiant> {
    return this._http.get<Etudiant>(`${URL}/${id}`);
  }

  rafraichir(id: string): Observable<Etudiant> {
    return this.getEtudiantById(id).pipe(
      tap(e => this.enregistrer(e))
    );
  }

  emailExiste(email: string): Observable<Etudiant[]> {
    return this._http.get<Etudiant[]>(URL, { params: { email } });
  }

  inscrire(donnees: Omit<Etudiant, 'id'>): Observable<Etudiant> {
    const nouveau: Etudiant = { ...donnees, id: crypto.randomUUID().slice(0, 8) };
    return this._http.post<Etudiant>(URL, nouveau).pipe(
      tap(e => {
        this._etudiants.update(all => [...all, e]);
        this.enregistrer(e);
      })
    );
  }

  login(email: string, password: string): Observable<Etudiant[]> {
    return this._http.get<Etudiant[]>(URL, { params: { email, password } }).pipe(
      tap(trouves => this.enregistrer(trouves.length > 0 ? trouves[0] : undefined))
    );
  }

  logout() {
    this.enregistrer(undefined);
  }

  modifier(etudiant: Etudiant): Observable<Etudiant> {
    return this._http.put<Etudiant>(`${URL}/${etudiant.id}`, etudiant).pipe(
      tap(maj => {
        this._etudiants.update(all => all.map(e => (e.id == maj.id) ? maj : e));
        if (this._etudiant()?.id == maj.id) {
          this.enregistrer(maj);
        }
      })
    );
  }

  supprimer(id: string): Observable<void> {
    return this._http.delete<void>(`${URL}/${id}`).pipe(
      tap(() => this._etudiants.update(all => all.filter(e => e.id != id)))
    );
  }

  private enregistrer(etudiant: Etudiant | undefined) {
    this._etudiant.set(etudiant);
    if (typeof sessionStorage === 'undefined') return;
    if (etudiant) {
      sessionStorage.setItem(CLE_SESSION, JSON.stringify(etudiant));
    } else {
      sessionStorage.removeItem(CLE_SESSION);
    }
  }

  private lireSession(): Etudiant | undefined {
    if (typeof sessionStorage === 'undefined') return undefined;
    const brut = sessionStorage.getItem(CLE_SESSION);
    return brut ? JSON.parse(brut) : undefined;
  }
}
