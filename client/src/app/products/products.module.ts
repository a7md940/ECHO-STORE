import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng5SliderModule } from 'ng5-slider';

import { PorductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '../shared/shared.module';
import { FilterSidebarComponent } from './filter-sidebar/filter-sidebar.component';
import { PriceControlComponent} from './price-control/price-control.component';
@NgModule({
  declarations: [
    ProductsComponent,
    ProductComponent,
    ProductsListComponent,
    FilterSidebarComponent,
    PriceControlComponent
  ],
  imports: [
  CommonModule,
    PorductsRoutingModule,
    SharedModule,
    Ng5SliderModule
  ]
})
export class ProductsModule { }
