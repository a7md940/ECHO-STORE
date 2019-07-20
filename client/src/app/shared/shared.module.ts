import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CollapsibleComponent } from './collapsible/collapsible.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollToTopComponent } from './scroll-to-top/scroll-to-top.component';
@NgModule({
  declarations: [NavbarComponent, BreadcrumbComponent, CollapsibleComponent, LoadingSpinnerComponent, ScrollToTopComponent],
  imports: [
    RouterModule,
    CommonModule,
    InfiniteScrollModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    CollapsibleComponent,
    LoadingSpinnerComponent,
    InfiniteScrollModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    FormsModule,
    ScrollToTopComponent
  ]
})
export class SharedModule { }
