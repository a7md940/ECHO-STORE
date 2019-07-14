import { Component, OnInit, Input, ViewChild, ElementRef, Output, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ValidatorFn, Validators, NgControl, FormGroup, FormBuilder } from '@angular/forms';
import { Options } from 'ng5-slider/options';
@Component({
  selector: 'app-price-control',
  templateUrl: './price-control.component.html',
  styleUrls: ['./price-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PriceControlComponent
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PriceControlComponent,
      multi: true
    }
  ]
})
export class PriceControlComponent implements OnInit {

  disabled;
  @Output()

  @Input() minValue = 10;
  @Input() maxValue = 100;
  priceRange = [10, 100];

  options: Options = {
    floor: 0,
    ceil: 250
  };

  changed(){
    this.priceRange=[...this.priceRange];
    }

  constructor(
    private formBuilder: FormBuilder
    ) {

  }

  ngOnInit() {

  }


}
