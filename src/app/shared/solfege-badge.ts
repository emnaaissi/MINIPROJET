import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-solfege-badge',
  templateUrl: './solfege-badge.html'
})
export class SolfegeBadge {
  possede = input.required<boolean>();
  inclus = input.required<boolean>();

  libelle = computed(() => {
    if (!this.possede()) return 'Sans solfège';
    return this.inclus() ? 'Solfège inclus' : 'Solfège non inclus';
  });
}
