import { Instrument } from '../models/instrument';

export function solfegeEffectif(instrument: Instrument, choisis: Instrument[]): boolean {
  if (!instrument.solfegeInclus) {
    return false;
  }
  const premier = choisis.find(i => i.solfegeInclus);
  return !premier || premier.id == instrument.id;
}
