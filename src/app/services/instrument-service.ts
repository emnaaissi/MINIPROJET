import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Instrument } from '../models/instrument';
import { API_URL } from '../config';

const URL = `${API_URL}/instruments`;

@Service()
export class InstrumentService {
  private readonly _http = inject(HttpClient);
  private readonly _instruments = signal<Instrument[]>([]);
  instruments = this._instruments.asReadonly();

  getInstruments(): Observable<Instrument[]> {
    return this._http.get<Instrument[]>(URL).pipe(
      tap(all => this._instruments.set(all))
    );
  }

  getInstrumentById(id: string): Observable<Instrument> {
    return this._http.get<Instrument>(`${URL}/${id}`);
  }

  addInstrument(instrument: Instrument): Observable<Instrument> {
    const nouveau = { ...instrument, id: crypto.randomUUID().slice(0, 8) };
    return this._http.post<Instrument>(URL, nouveau).pipe(
      tap(added => this._instruments.update(all => [...all, added]))
    );
  }

  updateInstrument(instrument: Instrument): Observable<Instrument> {
    return this._http.put<Instrument>(`${URL}/${instrument.id}`, instrument).pipe(
      tap(updated => this._instruments.update(all =>
        all.map(i => (i.id == updated.id) ? updated : i)
      ))
    );
  }

  deleteInstrument(id: string): Observable<void> {
    return this._http.delete<void>(`${URL}/${id}`).pipe(
      tap(() => this._instruments.update(all => all.filter(i => i.id != id)))
    );
  }
}
