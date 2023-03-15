import { Component } from '@angular/core'

@Component({
  selector: 'velo-routes',
  template: `<div>
    <i class="pi pi-stopwatch"></i>
    <h2>This feature is coming soon.</h2>
    <h3>Hopefully...</h3>
  </div>`,
  styles: [
    `
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem 0;
        color: var(--color-info);

        i {
          font-size: 4rem;
        }
      }
    `,
  ],
})
export class RoutesComponent {}
