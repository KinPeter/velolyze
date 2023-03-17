import { Component, Input } from '@angular/core'
import { ChartConfiguration } from 'chart.js/dist/types'

@Component({
  selector: 'velo-simple-line-chart',
  template: `
    <div class="chart-container">
      <canvas
        baseChart
        class="chart"
        [data]="chartData"
        [options]="lineChartOptions"
        type="line"
      ></canvas>
    </div>
  `,
  styles: [
    `
      .chart-container {
        position: relative;
        width: 100%;
      }

      canvas {
        // quite weird how it resizes... see https://www.chartjs.org/docs/latest/configuration/responsive.html
        width: 200px;
        height: 130px;
      }
    `,
  ],
})
export class SimpleLineChartComponent {
  @Input() set lineChartData(values: number[]) {
    this.chartData = {
      datasets: [
        {
          data: values,
          label: '',
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(
            '--surface-border'
          ),
          borderColor: getComputedStyle(document.documentElement).getPropertyValue(
            '--primary-color'
          ),
          fill: 'origin',
        },
      ],
      labels: new Array(values.length).fill(''),
    }
  }

  public chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.5,
      },
      point: {
        pointStyle: false,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: false,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }
}
