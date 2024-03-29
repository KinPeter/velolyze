import { Component, OnDestroy } from '@angular/core'
import { combineLatest, filter, Subject, takeUntil } from 'rxjs'
import { map } from 'rxjs/operators'
import { StravaBikeData } from '../../strava/strava.types'
import {
  Activity,
  ActivityFilterEvent,
  ActivityFilterOptions,
  ActivityFilters,
} from '../../shared/types/activities'
import { ActivitiesService } from '../../shared/services/activities.service'
import { UserMetaService } from '../../shared/services/user-meta.service'
import { Totals } from '../me/me.types'
import { getTotals } from '../../../utils/me-data.utils'
import {
  filterActivities,
  generateFilterTitle,
  getFilterOptions,
} from '../../../utils/activity.utils'

@Component({
  selector: 'velo-activities',
  template: `
    <ng-container *ngIf="loading$ | async; else outerContainer">
      <p-progressSpinner class="velo-spinner"></p-progressSpinner>
    </ng-container>
    <p-sidebar [(visible)]="filtersOpen" [fullScreen]="true" [showCloseIcon]="true">
      <ng-template pTemplate="header">
        <h1>Filter rides</h1>
      </ng-template>
      <ng-template pTemplate="content">
        <velo-filters
          [filterOptions]="filterOptions"
          [bikeOptions]="bikes"
          [appliedFilters]="appliedFilters"
          (filter)="onFilter($event)"
        ></velo-filters>
      </ng-template>
    </p-sidebar>
    <ng-template #outerContainer>
      <velo-no-data *ngIf="!activities.length; else activitiesContainer"></velo-no-data>
      <ng-template #activitiesContainer>
        <velo-horizontal-totals-card
          [totals]="totals"
          [title]="title"
          (openFilters)="filtersOpen = true"
        ></velo-horizontal-totals-card>
        <section class="main-content">
          <p-card>
            <p-tabView>
              <p-tabPanel header="List">
                <velo-activities-table
                  *ngIf="filteredActivities.length"
                  [activities]="filteredActivities"
                ></velo-activities-table>
                <section *ngIf="!filteredActivities.length" class="no-result">
                  <p>There are no results.</p>
                  <p><em>Maybe consider changing your filters?</em></p>
                </section>
              </p-tabPanel>
              <p-tabPanel header="Charts"> Content 2 </p-tabPanel>
            </p-tabView>
          </p-card>
        </section>
      </ng-template>
    </ng-template>
  `,
  styles: [
    `
      .main-content {
        margin-top: 1rem;
      }

      :host ::ng-deep {
        .p-card-body {
          padding: 0;

          .p-card-content {
            padding: 0;
          }
        }
      }

      section.no-result {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem 0;
      }
    `,
  ],
})
export class ActivitiesComponent implements OnDestroy {
  public loading$ = combineLatest([
    this.activitiesService.loading$,
    this.userMetaService.loading$,
  ]).pipe(map(([a, b]) => a || b))

  public bikes: StravaBikeData[] = []
  public activities: Activity[] = []
  public filteredActivities: Activity[] = []
  public totals!: Totals
  public filtersOpen = false
  public filterOptions!: ActivityFilterOptions
  public appliedFilters: ActivityFilters | undefined
  public title = 'All rides'

  private unsubscribe$ = new Subject<boolean>()

  constructor(
    private activitiesService: ActivitiesService,
    private userMetaService: UserMetaService
  ) {
    this.activitiesService.activities$.pipe(takeUntil(this.unsubscribe$)).subscribe(activities => {
      const sortedActivities = activities.sort((a, b) => b.date - a.date)
      this.activities = sortedActivities
      this.filteredActivities = [...sortedActivities]
      this.totals = getTotals(activities.map(a => a.activity))
      this.filterOptions = getFilterOptions(activities)
    })
    this.userMetaService.userMeta$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(({ bikes }) => {
        this.bikes = bikes
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(true)
  }

  public onFilter({ reset, filters }: ActivityFilterEvent): void {
    const filteredActivities = filterActivities(this.activities, filters)
    this.totals = getTotals(filteredActivities.map(a => a.activity))
    this.title = reset ? 'All rides' : generateFilterTitle(filters)
    this.filteredActivities = filteredActivities
    this.appliedFilters = filters
    this.filtersOpen = false
  }
}
