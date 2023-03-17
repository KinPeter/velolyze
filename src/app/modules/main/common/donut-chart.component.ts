import { Component, Input } from '@angular/core'
import { ChartConfiguration } from 'chart.js'

@Component({
  selector: 'velo-donut-chart',
  template: `
    <div class="chart-container">
      <canvas baseChart class="chart" [data]="chartData" [options]="chartOptions" type="doughnut">
      </canvas>
    </div>
  `,
  styles: [
    `
      .chart-container {
        position: relative;
        width: 100%;
      }

      canvas {
        width: 200px;
        height: 200px;
      }
    `,
  ],
})
export class DonutChartComponent {
  @Input() set donutChartData(items: Record<string, number>) {
    const entries = Object.entries(items)
    const style = getComputedStyle(document.documentElement)
    this.chartData = {
      labels: entries.map(([label, _]) => label),
      datasets: [
        {
          data: entries.map(([_, value]) => value),
          backgroundColor: [
            style.getPropertyValue('--blue-500'),
            style.getPropertyValue('--red-500'),
            style.getPropertyValue('--purple-500'),
            style.getPropertyValue('--green-500'),
            style.getPropertyValue('--orange-500'),
            style.getPropertyValue('--indigo-500'),
            style.getPropertyValue('--pink-500'),
          ],
        },
      ],
    }
  }

  public chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  }

  public chartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    cutout: '85%',
    circumference: 180,
    rotation: -90,
    borderColor: 'transparent',
    spacing: 6,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
  } as ChartConfiguration['options']
}
