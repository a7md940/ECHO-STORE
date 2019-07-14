import { Component, OnInit } from '@angular/core';
import { ComputerService } from './../core/services/computer.service';
import { ComputerFilter, Filter } from 'src/app/shared/models/computer-filter';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  computers: Array<any>;
  pageSize = 12;
  onScrollPaginationCounter = 1;

  filters: ComputerFilter;

  productsState = {
    loading: false,
    loaded: false,
    faild: false
  }

  productsWithoutFilterCleaded: number = 0; // 0 --> not cleared : 1 --> cleared.

  constructor(
    private computerSevice: ComputerService
  ) { }

  ngOnInit() {
    this.productsState.loading = true;
    const skip = 0;
    this.computerSevice.getAllComputers(skip, this.pageSize)
    .subscribe((computers: Array<any>) => {
      this.computers = computers;
      console.log({computers});
      this.productsState.loading = false;
      this.productsState.loaded = true;
    })
    console.log('product init()');
  }

  getProducts(filter: Array<Filter>) {
    console.table(filter)
    const skip = 0
    const queryFilter: ComputerFilter = {
      skip,
      take: this.pageSize,
      filter,
      filterLogic: 2
    }
    this.filters = queryFilter;
    this.computerSevice.getComputers(this.filters)
    .subscribe((resp) => {
      this.computers.splice(0, this.computers.length);
      resp.forEach(computer => {
        this.computers.push(computer);
      })
    })
  }
  getProductsOnScroll() {
    console.log('#1 scroll with filter fires()')
    this.onScrollPaginationCounter++;

    if (!this.filters) {
      const skip = this.onScrollPaginationCounter * this.pageSize;
      this.productsState.loading = true;
      this.computerSevice.getAllComputers(skip, this.pageSize)
      .subscribe((computers) => {
        computers.forEach((computer, i, self) => {
          this.computers.push(computer);
          this.productsState.loading = false;
          this.productsState.loaded = true;
        })

      });
    } else {
      console.log('scroll with filter fires()')
      this.filters.skip = (this.onScrollPaginationCounter - 1 ) * this.pageSize;
      this.filters.take = this.pageSize;
      this.computerSevice.getComputers(this.filters)
      .subscribe((resp) => {
        resp.forEach(computer => {
          this.computers.push(computer);
        })
      })
    }
  }

}
