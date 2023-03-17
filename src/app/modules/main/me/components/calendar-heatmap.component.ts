import { Component, Input } from '@angular/core'
import { CalendarHeatmapData } from '../me.types'
import { subDays } from 'date-fns'

@Component({
  selector: 'velo-calendar-heatmap',
  template: `
    <div class="container">
      <div class="months">
        <span
          *ngFor="let label of monthLabels"
          class="month-label"
          [ngStyle]="{ left: 22 * (label.week - 1) + 'px' }"
          >{{ label.month }}</span
        >
      </div>
      <div class="grid">
        <ng-container *ngFor="let day of calendarDays">
          <div
            class="day"
            [ngClass]="day.class"
            [pTooltip]="day.tooltip"
            tooltipStyleClass="calendar-heatmap-day-tooltip"
          ></div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        width: calc(22px * 53 - 5px);
        margin: 2rem 0;
      }

      .months {
        position: relative;
        height: 22px;

        span {
          color: var(--text-color-secondary);
          font-size: 0.9rem;
          position: absolute;
          top: 0;
        }
      }

      .grid {
        display: grid;
        grid-auto-flow: column;
        grid-template-columns: repeat(53, 1fr);
        grid-template-rows: repeat(7, 1fr);
        grid-gap: 5px;
      }

      .day {
        height: 17px;
        width: 17px;
        border-radius: 4px;
        background-color: var(--surface-d);

        &.empty {
          background-color: transparent;
        }

        &.low {
          background-color: var(--primary-900);
        }

        &.medium {
          background-color: var(--primary-800);
        }

        &.high {
          background-color: var(--primary-500);
        }

        &.extreme {
          background-color: var(--primary-300);
        }
      }
    `,
  ],
})
export class CalendarHeatmapComponent {
  @Input() set days(days: CalendarHeatmapData[]) {
    const emptyDays: CalendarHeatmapData[] = []
    const firstDay = days[0].dayOfWeek
    if (firstDay !== 1) {
      for (let i = 1; i < firstDay; i++) {
        emptyDays.push({
          empty: true,
          dayOfWeek: i,
          dayOfMonth: 0,
          month: '',
          date: subDays(days[0].date, firstDay - i),
          rides: 0,
          distance: 0,
          class: 'empty',
          tooltip: '',
        })
      }
    }
    this.calendarDays = [...emptyDays, ...days]

    const monthLabels: { week: number; month: string }[] = []
    days.forEach((day, index) => {
      if (day.dayOfMonth === 1) {
        monthLabels.push({ week: Math.round(index / 7) + 1, month: day.month })
      }
    })
    this.monthLabels = monthLabels
  }

  public calendarDays: CalendarHeatmapData[] = []
  public monthLabels: { week: number; month: string }[] = []

  constructor() {}
}
