import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appColumnResize]',
  standalone: true
})
export class ColumnResizeDirective {
  @Input('appColumnResize') enabled = true;

  private startX = 0;
  private startWidth = 0;
  private resizing = false;
  private readonly handle: HTMLElement;

  constructor(private readonly el: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {
    this.handle = this.renderer.createElement('span');
    this.renderer.addClass(this.handle, 'resize-handle');
    this.renderer.setStyle(this.handle, 'position', 'absolute');
    this.renderer.setStyle(this.handle, 'top', '0');
    this.renderer.setStyle(this.handle, 'right', '0');
    this.renderer.setStyle(this.handle, 'width', '8px');
    this.renderer.setStyle(this.handle, 'cursor', 'col-resize');
    this.renderer.setStyle(this.handle, 'height', '100%');
    this.renderer.setStyle(this.handle, 'z-index', '10');
    this.renderer.appendChild(this.el.nativeElement, this.handle);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (!this.enabled || event.target !== this.handle) {
      return;
    }
    this.resizing = true;
    this.startX = event.pageX;
    this.startWidth = this.el.nativeElement.offsetWidth;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.resizing) {
      return;
    }
    const width = this.startWidth + (event.pageX - this.startX);
    this.renderer.setStyle(this.el.nativeElement, 'width', `${Math.max(width, 80)}px`);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.resizing = false;
  }
}
