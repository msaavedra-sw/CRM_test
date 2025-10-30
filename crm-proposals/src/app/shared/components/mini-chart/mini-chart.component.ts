import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MiniChartType = 'bar' | 'line' | 'donut';

@Component({
  selector: 'app-mini-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-chart.component.html',
  styleUrl: './mini-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniChartComponent implements AfterViewInit {
  @Input() type: MiniChartType = 'bar';
  @Input() values: number[] = [];

  @ViewChild('canvas', { static: true }) canvasRef?: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.render();
  }

  private render(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);

    switch (this.type) {
      case 'bar':
        this.renderBars(context, width, height);
        break;
      case 'line':
        this.renderLine(context, width, height);
        break;
      case 'donut':
        this.renderDonut(context, width, height);
        break;
      default:
        break;
    }
  }

  private renderBars(context: CanvasRenderingContext2D, width: number, height: number): void {
    const max = Math.max(...this.values, 1);
    const barWidth = width / this.values.length;
    this.values.forEach((value, index) => {
      const barHeight = (value / max) * height;
      context.fillStyle = '#4f46ef';
      context.fillRect(index * barWidth, height - barHeight, barWidth - 4, barHeight);
    });
  }

  private renderLine(context: CanvasRenderingContext2D, width: number, height: number): void {
    const max = Math.max(...this.values, 1);
    const step = width / (this.values.length - 1);
    context.strokeStyle = '#4f46ef';
    context.lineWidth = 2;
    context.beginPath();
    this.values.forEach((value, index) => {
      const x = index * step;
      const y = height - (value / max) * height;
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();
  }

  private renderDonut(context: CanvasRenderingContext2D, width: number, height: number): void {
    const total = this.values.reduce((acc, value) => acc + value, 0) || 1;
    let startAngle = 0;
    const radius = Math.min(width, height) / 2 - 4;
    const centerX = width / 2;
    const centerY = height / 2;
    const colors = ['#4f46ef', '#7f5bff', '#9f7fff'];

    this.values.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.fillStyle = colors[index % colors.length];
      context.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      context.closePath();
      context.fill();
      startAngle += sliceAngle;
    });

    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(centerX, centerY, radius / 2, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = 'source-over';
  }
}
