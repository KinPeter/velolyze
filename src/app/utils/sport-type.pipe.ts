import { Pipe, PipeTransform } from '@angular/core'
import { getSportType } from './utils'
import { SportType } from '../modules/strava/strava.types'

@Pipe({ name: 'sportType' })
export class SportTypePipe implements PipeTransform {
  public transform(sportType: SportType): string {
    return getSportType(sportType)
  }
}
