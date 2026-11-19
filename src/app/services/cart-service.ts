import { computed, Service, signal } from '@angular/core';
import { Instrument } from '../models/instrument';

@Service()
export class CartService {
  private readonly _items = signal<Instrument[]>([]);
  items = this._items.asReadonly();
  count = computed(() => this._items().length);
  total = computed(() => this._items().reduce((somme, i) => somme + i.prix, 0));

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
  }

  clear() {
    this._items.set([]);
  }
}
