import { Component, OnInit, ElementRef, AfterContentInit, AfterViewInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent implements OnInit, AfterContentInit, AfterViewInit{
  height: number;
  isHidden = false;
  @Input() title: string;
  @Input() openByDefault: boolean
  @Output() expanded = new EventEmitter();

  @ViewChild('toggler') toggler: ElementRef
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

  if (this.openByDefault) {
    setTimeout(() => {
      this.toggle()    
    });
  }
}
  toggle() {
    this.isHidden = !this.isHidden;

    const toggleIcon = this.toggler.nativeElement as HTMLSpanElement
    this.isHidden ? toggleIcon.classList.remove('open') : toggleIcon.classList.add('open')

    if (this.isHidden) {
      this.expanded.emit(false);
    } else {
      this.expanded.emit(true);
    }
  }
}
