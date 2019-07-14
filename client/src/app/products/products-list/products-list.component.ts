import { EventEmitter, Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, Output } from '@angular/core';
import { Filter, ComputerFilter } from './../../shared/models/computer-filter';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, AfterViewInit {
  @Input('products') products;
  @ViewChild('container') container: ElementRef;
  @Output() paginateOnScroll = new EventEmitter();
  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    const componentContainer = this.container.nativeElement as HTMLElement;
    window.addEventListener('scroll', (e) => {
      const {bottom} = componentContainer.getBoundingClientRect();
      // console.log(bottom, window.innerHeight)
      // console.log(window.innerHeight , componentContainer.scrollTop, componentContainer.offsetHeight)
      // if (window.innerHeight + componentContainer.scrollTop
      // === componentContainer.offsetHeight) {
      if (Math.floor(bottom) <= window.innerHeight) {
        // setTimeout(() => {
        //   this.paginateOnScroll.emit(true);
        //   console.log('fires() paginations');
        // }, 100);
      }
    });
  }


}
