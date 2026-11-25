import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jour' })
export class JourPipe implements PipeTransform {
  private readonly jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  transform(date: string): string {
    return this.jours[new Date(date).getUTCDay()];
  }
}
