import { Component, OnInit, Input } from '@angular/core';
import { Computer } from 'src/app/shared/models/computer';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: Computer;
  constructor() { }

  ngOnInit() {
  }

}
