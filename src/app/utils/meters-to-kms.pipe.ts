import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'metersToKms' })
export class MetersToKmsPipe implements PipeTransform {
  public transform(meters: number): number {
    return Math.round(meters / 100) / 10
  }
}
