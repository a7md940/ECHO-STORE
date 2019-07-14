import { Component, OnInit, ElementRef, AfterContentInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent implements OnInit, AfterContentInit, AfterViewInit{
  height: number;
  isHidden = false;
  @Input() title: string;
  @Output() expanded = new EventEmitter();

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    const el = (this.el.nativeElement as HTMLElement).querySelector('.collapse_content');
    this.height = el.getBoundingClientRect().height;

    this.isHidden = true;

  }
ngAfterViewInit() {
  const content = (this.el.nativeElement as HTMLElement).querySelector('.collapse_content') as HTMLElement;
  content.style.height = '0px';
}
  toggle() {
    this.isHidden = !this.isHidden;

    console.log('toggle', this.isHidden);
    if (this.isHidden) {
      this.expanded.emit(false);
    } else {
      this.expanded.emit(true);
    }
  }
}
