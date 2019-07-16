import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Options } from 'ng5-slider/options';
import { ChangeContext } from 'ng5-slider/change-context';


@Component({
  selector: 'app-price-control',
  templateUrl: './price-control.component.html',
  styleUrls: ['./price-control.component.scss'],
})
export class PriceControlComponent implements OnInit {

  @Output() range = new EventEmitter();

  @Input() minValue = 10;
  @Input() maxValue = 100;
  priceRange = [this.minValue, this.maxValue];

  options: Options = {
    floor: 0,
    ceil: 250
  };

  userChangeEnd(e: ChangeContext) {
    this.range.emit({min: e.value, max: e.highValue})
  }

  constructor() {

  }

  ngOnInit() {

  }


}
