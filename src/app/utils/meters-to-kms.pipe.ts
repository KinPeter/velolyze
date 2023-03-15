import { Pipe, PipeTransform } from '@angular/core'
import { metersToKms } from './utils'

@Pipe({ name: 'metersToKms' })
export class MetersToKmsPipe implements PipeTransform {
  public transform(meters: number): number {
    return metersToKms(meters)
  }
}
