import { computed, Service, signal } from '@angular/core';
import { Instrument } from '../models/instrument';

@Service()
export class CartService {
  private readonly _items = signal<Instrument[]>([]);
  private readonly _solfege = signal(false);

  items = this._items.asReadonly();
  solfege = this._solfege.asReadonly();

  count = computed(() => this._items().length);
  total = computed(() => this._items().reduce((somme, i) => somme + i.prix, 0));
  proposeSolfege = computed(() => this._items().some(i => i.solfegeInclus));

  contient(id: string): boolean {
    return this._items().some(i => i.id == id);
  }

  add(instrument: Instrument) {
    if (!this.contient(instrument.id)) {
      this._items.update(items => [...items, instrument]);
    }
  }

  remove(id: string) {
    this._items.update(items => items.filter(i => i.id != id));
    if (!this.proposeSolfege()) {
      this._solfege.set(false);
    }
  }

  setSolfege(choix: boolean) {
    this._solfege.set(choix && this.proposeSolfege());
  }

  clear() {
    this._items.set([]);
    this._solfege.set(false);
  }
}
