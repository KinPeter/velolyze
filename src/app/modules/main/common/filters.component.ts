import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { StravaBikeData } from '../../strava/strava.types'
import {
  ActivityFilterEvent,
  ActivityFilterOptions,
  ActivityFilters,
  FilterPeriodType,
  RideEnvironment,
} from '../../shared/types/activities'
import { Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'velo-filters',
  template: `
    <form [formGroup]="form">
      <section class="dates">
        <div class="period-types">
          <div *ngFor="let periodType of periodTypes" class="field-checkbox">
            <p-radioButton
              [inputId]="periodType"
              [value]="periodType"
              formControlName="periodType"
            ></p-radioButton>
            <label [for]="periodType">{{ periodType }}</label>
          </div>
        </div>
        <div class="date" *ngIf="form.value['periodType'] === periodTypeEnum.RANGE">
          <span class="p-float-label">
            <p-calendar
              formControlName="dateRange"
              selectionMode="range"
              [readonlyInput]="true"
              [showIcon]="true"
              [minDate]="startDate"
              [maxDate]="today"
              dateFormat="M d, yy"
              inputId="range"
              styleClass="velo-filter-input"
            ></p-calendar>
            <label for="range">Date range</label>
          </span>
        </div>
        <div class="date" *ngIf="form.value['periodType'] === periodTypeEnum.YEAR">
          <span class="p-float-label">
            <p-calendar
              formControlName="year"
              view="year"
              [readonlyInput]="true"
              [showIcon]="true"
              [minDate]="startDate"
              [maxDate]="today"
              dateFormat="yy"
              inputId="year"
              styleClass="velo-filter-input"
            ></p-calendar>
            <label for="year">Year</label>
          </span>
        </div>
        <div class="date" *ngIf="form.value['periodType'] === periodTypeEnum.MONTH">
          <span class="p-float-label">
            <p-calendar
              formControlName="month"
              view="month"
              [readonlyInput]="true"
              [showIcon]="true"
              [minDate]="startDate"
              [maxDate]="today"
              dateFormat="M, yy"
              inputId="month"
              styleClass="velo-filter-input"
            ></p-calendar>
            <label for="month">Month</label>
          </span>
        </div>
      </section>

      <section class="dropdowns">
        <div class="dropdown" *ngIf="countries.length">
          <span class="p-float-label">
            <p-multiSelect
              formControlName="countries"
              inputId="country"
              [options]="countries"
              placeholder="Select a country"
              display="chip"
              styleClass="velo-filter-input"
            ></p-multiSelect>
            <label for="country">Country</label>
          </span>
        </div>
        <div class="dropdown" *ngIf="cities.length">
          <span class="p-float-label">
            <p-multiSelect
              formControlName="cities"
              inputId="city"
              [options]="cities"
              placeholder="Select a city"
              display="chip"
              styleClass="velo-filter-input"
            ></p-multiSelect>
            <label for="city"></label>
          </span>
        </div>
      </section>

      <section class="dropdowns">
        <div class="dropdown" *ngIf="bikes.length">
          <span class="p-float-label">
            <p-multiSelect
              formControlName="bikes"
              inputId="bike"
              [options]="bikes"
              placeholder="Select a bike"
              optionLabel="name"
              optionValue="id"
              display="chip"
              styleClass="velo-filter-input"
            ></p-multiSelect>
            <label for="bike">Bikes</label>
          </span>
        </div>
        <div class="dropdown" *ngIf="types.length > 1">
          <span class="p-float-label">
            <p-multiSelect
              formControlName="types"
              inputId="type"
              [options]="types"
              placeholder="Select a ride type"
              optionLabel="name"
              optionValue="type"
              display="chip"
              styleClass="velo-filter-input"
            ></p-multiSelect>
            <label for="bike">Ride types</label>
          </span>
        </div>
      </section>

      <section class="dropdowns">
        <div class="dropdown" *ngIf="environments.length">
          <span class="p-float-label">
            <p-dropdown
              formControlName="environment"
              inputId="environment"
              [options]="environments"
              placeholder="Indoor / Outdoor"
              styleClass="velo-filter-input"
            ></p-dropdown>
            <label for="environment">Indoor / Outdoor</label>
          </span>
        </div>
      </section>

      <section class="sliders">
        <div class="slider">
          <label for="distance">
            Distance: {{ form.value['distance'][0] }} - {{ form.value['distance'][1] }} km
          </label>
          <p-slider
            formControlName="distance"
            [range]="true"
            [min]="0"
            [max]="maxDistance"
          ></p-slider>
        </div>
        <div class="slider">
          <label for="elevation">
            Elevation gain: {{ form.value['elevation'][0] }} - {{ form.value['elevation'][1] }} m
          </label>
          <p-slider
            formControlName="elevation"
            [range]="true"
            [min]="0"
            [max]="maxElevation"
          ></p-slider>
        </div>
      </section>

      <section class="actions">
        <p-button
          label="Reset filters"
          styleClass="p-button-outlined p-button-secondary"
          (click)="resetFilters()"
        ></p-button>
        <p-button label="Filter rides" (click)="filterRides()"></p-button>
      </section>
    </form>
  `,
  styles: [
    `
      form {
        height: calc(100vh - 160px);
      }

      section {
        display: flex;
        margin-bottom: 3rem;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .period-types {
        display: flex;
        gap: 1rem;
        width: 320px;

        label {
          margin-left: 1rem;
          position: relative;
          bottom: 2px;
        }
      }

      .slider {
        width: 320px;
        padding: 0 1rem;

        label {
          margin-bottom: 1rem;
          display: block;
          color: var(--text-color);
        }
      }

      section.actions {
        margin: 5rem 0 0;
        justify-content: flex-end;
      }
    `,
  ],
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Input() set filterOptions(options: ActivityFilterOptions) {
    this.startDate = new Date(options.startYear, 0, 1)
    this.cities = options.cities
    this.countries = options.countries
    this.maxDistance = Math.ceil(options.maxDistance)
    this.maxElevation = Math.ceil(options.maxElevation)
    this.environments = options.hasIndoor ? Object.values(RideEnvironment) : []
    this.types = options.types
    this.form.get('distance')?.setValue([0, options.maxDistance])
    this.form.get('elevation')?.setValue([0, options.maxElevation])
    this.form.get('dateRange')?.setValue([this.startDate, this.today])
  }

  @Input() set bikeOptions(bikeOptions: StravaBikeData[]) {
    this.bikes = bikeOptions
  }

  @Input() set appliedFilters(filters: ActivityFilters | undefined) {
    if (filters) {
      this.form.setValue(filters)
      this.shouldReset = false
    }
  }

  @Output() filter = new EventEmitter<ActivityFilterEvent>()

  public periodTypeEnum = FilterPeriodType
  public periodTypes = Object.values(FilterPeriodType)
  public startDate = new Date()
  public today = new Date()
  public cities: string[] = []
  public countries: string[] = []
  public types: { name: string; type: string }[] = []
  public environments: RideEnvironment[] = []
  public bikes: StravaBikeData[] = []
  public maxDistance = 0
  public maxElevation = 0

  public form: FormGroup = this.formBuilder.group({
    periodType: [FilterPeriodType.RANGE, Validators.required],
    dateRange: [null],
    year: [null],
    month: [null],
    types: [null],
    environment: [RideEnvironment.ALL, Validators.required],
    bikes: [null],
    cities: [null],
    countries: [null],
    distance: [[0, 0]],
    elevation: [[0, 0]],
  })

  private shouldReset = false
  private unsubscribe$ = new Subject<boolean>()

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit() {
    this.form.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
      this.shouldReset = false
    })
  }

  public ngOnDestroy() {
    this.unsubscribe$.next(true)
  }

  public resetFilters(): void {
    this.form.setValue({
      periodType: FilterPeriodType.RANGE,
      dateRange: [this.startDate, this.today],
      year: null,
      month: null,
      types: null,
      environment: RideEnvironment.ALL,
      bikes: null,
      cities: null,
      countries: null,
      distance: [0, this.maxDistance],
      elevation: [0, this.maxElevation],
    })
    this.shouldReset = true
  }

  public filterRides(): void {
    this.filter.emit({ reset: this.shouldReset, filters: this.form.value })
    this.shouldReset = false
  }
}
