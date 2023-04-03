import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { StravaBikeData } from '../../strava/strava.types'
import {
  ActivityFilterOptions,
  ActivityFilters,
  FilterPeriodType,
  RideEnvironment,
} from '../../shared/types/activities'

@Component({
  selector: 'velo-filters',
  template: `
    <form [formGroup]="form">
      <div *ngFor="let periodType of periodTypes" class="field-checkbox">
        <p-radioButton
          [inputId]="periodType"
          [value]="periodType"
          formControlName="periodType"
        ></p-radioButton>
        <label [for]="periodType" class="ml-2">{{ periodType }}</label>
      </div>
      <p-dropdown
        *ngIf="countries.length"
        formControlName="country"
        [options]="countries"
        placeholder="Select a country"
      ></p-dropdown>
      <p-dropdown
        *ngIf="cities.length"
        formControlName="city"
        [options]="cities"
        placeholder="Select a city"
      ></p-dropdown>
      <p-dropdown
        *ngIf="environments.length"
        formControlName="environment"
        [options]="environments"
        placeholder="Indoor / Outdoor"
      ></p-dropdown>
    </form>
  `,
  styles: [``],
})
export class FiltersComponent implements OnInit {
  @Input() set filterOptions(options: ActivityFilterOptions) {
    this.setYearOptions(options.startYear)
    this.cities = options.cities
    this.countries = options.countries
    this.maxDistance = options.maxDistance
    this.maxElevation = options.maxElevation
    this.environments = options.hasIndoor ? Object.values(RideEnvironment) : []
  }

  @Input() set bikeOptions(bikeOptions: StravaBikeData[]) {
    this.bikes = bikeOptions
  }

  @Output() filter = new EventEmitter<ActivityFilters>()

  public periodTypes = Object.values(FilterPeriodType)
  public years: number[] = []
  public months = [
    { index: 0, name: 'January' },
    { index: 1, name: 'February' },
    { index: 2, name: 'March' },
    { index: 3, name: 'April' },
    { index: 4, name: 'May' },
    { index: 5, name: 'June' },
    { index: 6, name: 'July' },
    { index: 7, name: 'August' },
    { index: 8, name: 'September' },
    { index: 9, name: 'October' },
    { index: 10, name: 'November' },
    { index: 11, name: 'December' },
  ]
  public cities: string[] = []
  public countries: string[] = []
  public types: string[] = []
  public environments: RideEnvironment[] = []
  public bikes: StravaBikeData[] = []
  public maxDistance = 0
  public maxElevation = 0

  public form: FormGroup = this.formBuilder.group({
    periodType: [FilterPeriodType.RANGE, Validators.required],
    dateRange: [null],
    year: [null],
    month: [null],
    type: ['ALL'],
    environment: [RideEnvironment.ALL, Validators.required],
    bike: [null],
    city: [''],
    country: [''],
    distance: this.formBuilder.group({ max: [0], min: [0] }),
    elevation: this.formBuilder.group({ max: [0], min: [0] }),
  })

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    console.log('filters init')
  }

  private setYearOptions(startYear: number): void {
    const currentYear = new Date().getFullYear()
    if (startYear === currentYear) {
      this.years = [currentYear]
    } else {
      let year = startYear
      while (year <= currentYear) {
        this.years.push(year++)
      }
    }
  }
}
