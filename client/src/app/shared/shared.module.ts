import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CollapsibleComponent } from './collapsible/collapsible.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
  declarations: [NavbarComponent, BreadcrumbComponent, CollapsibleComponent, LoadingSpinnerComponent],
  imports: [
    RouterModule,
    CommonModule,
    InfiniteScrollModule
  ],
  exports: [
    NavbarComponent,
    CollapsibleComponent,
    LoadingSpinnerComponent,
    InfiniteScrollModule
  ]
})
export class SharedModule { }
