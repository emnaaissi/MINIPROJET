import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Instrument } from '../models/instrument';

@Component({
  selector: 'app-instrument-card',
  imports: [RouterLink],
  templateUrl: './instrument-card.html'
})
export class InstrumentCard {
  instrument = input.required<Instrument>();
}
