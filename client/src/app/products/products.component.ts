import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ComputerService } from './../core/services/computer.service';
import { ComputerFilter, Filter } from 'src/app/shared/models/computer-filter';
import { filterLogic } from 'src/app/shared/models/enums/filter-logic';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { EventBuss } from '../core/services/event.buss.service';
import { skipWhile, takeWhile } from 'rxjs/operators'
import { ComputerDTO } from '../shared/models/computer';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  computers: Array<any>;
  pageSize = 12;
  onScrollPaginationCounter = 1;

  filters: ComputerFilter = {
    skip: 0,
    take: this.pageSize,
    filter: [],
    searchText: null
  }

  productsState = {
    loading: false,
    loaded: false,
    faild: false,
    resultCount: 0
  }

  productsWithoutFilterCleaded: number = 0; // 0 --> not cleared : 1 --> cleared.


  searchForm: FormGroup
  
  constructor(
    private computerSevice: ComputerService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private eBuss: EventBuss,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildSearchForm()

    this.route.queryParams.subscribe(query => {
      if (query) {
        this.filters.filter = []
        if (query.q && query.c) {
          this.filters.searchText = [query.q, query.c]
        }

        if (!query.c && query.q) {
          this.filters.searchText = [query.q]
        }

        if (query.c && !query.q) {
          this.filters.searchText = [query.c]
        }
      }
    })
      
    // this.computerSevice.getAllComputers(0, this.pageSize)
    //     .subscribe((computers: Array<any>) => {
    //       this.computers = computers;
    //       console.log({computers})
    //       this.productsState.loading = false;
    //       this.productsState.loaded = true;
    //     })
    this.getAllComputers()
  }

  getAllComputers() {
    this.route.queryParams.subscribe(query => {
      const { q, c }= query
      if (!q && !c) {
        this.productsState.loading = true;
        const skip = 0;
        this.computerSevice.getAllComputers(skip, this.pageSize)
        .subscribe((computers: Array<any>) => {
          this.computers = computers;
          console.log({computers})
          this.productsState.loading = false;
          this.productsState.loaded = true;
        })
      } else {
        this.getProductsByFilter()
      }
    })
  }
  ngAfterViewInit() {
    // this.watchFilterSearchToEmitEventWhenClear()
  }

  // watchFilterSearchToEmitEventWhenClear() {
  //   this.searchForm.get('text').valueChanges.pipe(skipWhile(text =>!!text))
  //   .subscribe(text => {
  //     if (!text) {
  //       this.eBuss.emit('clearSearchText', true)
  //     }
  //   })
  // }

  buildSearchForm() {
    this.searchForm = this.fb.group({
      text: ['', []],
      Company: ['', []]
    }, {
      validators: [this.atLeastOneRequired]
    })
  }

  get sF(): { [key: string]: AbstractControl } { return this.searchForm.controls }
  get searchText() : string { return this.sF.text.value }
  get companyText(): string { return this.sF.Company.value }
  search() {
    if (this.searchForm.invalid) {
      for (const prop in this.searchForm.controls) {
        this.searchForm.controls[prop].markAsTouched()
      }
      return
    }

    // reset all filters, to search with new text
    this.filters.filter = []

    let {text, Company} = this.searchForm.value
    text = text.trim().toLowerCase()
    Company = Company.trim().toLowerCase()

    // reassign filters array to reset filter criteria
    this.eBuss.emit('searchTextTrigger',  true)
    this.router.navigate(this.route.snapshot.url, { queryParams: {q: text, c: Company }})
    console.log(this.filters)
    // this.getProductsByFilter()
  }

  private isSearchFilterExist(): boolean {
    // Product is the computer name in db
    return !!this.filters.searchText && this.filters.searchText.length > 0
  }

  private thereIsAnotherFilterOptionsComming(filterArray: Array<Filter>): boolean {
    return filterArray.length > 0
  }

  setFilter(filter: Array<Filter>) {
    this.onScrollPaginationCounter = 1
    const skip = 0
    this.filters.skip = skip
    const queryFilter: ComputerFilter = {
      skip,
      take: this.pageSize,
      filter: [...filter],
      filterLogic: filter.length == 1 ? null : filterLogic.and
    }
    
    filter.length < 2 ? this.filters.filterLogic = null : this.filters.filterLogic = filterLogic.and

    if (this.isSearchFilterExist() && this.thereIsAnotherFilterOptionsComming(filter)) {
      queryFilter.searchText = `${this.searchText} ${this.companyText}`.split('')
      this.filters.filter =  queryFilter.filter
    } else if (!this.thereIsAnotherFilterOptionsComming(filter) && this.isSearchFilterExist()) {
      this.filters.filter = this.filters.filter.filter(x => x.field == 'Product')
    } else if (this.thereIsAnotherFilterOptionsComming(filter) && !this.isSearchFilterExist()) {
      this.filters = queryFilter
    } else if (!this.thereIsAnotherFilterOptionsComming(filter) && !this.isSearchFilterExist()) {
      this.computerSevice.getAllComputers(this.filters.skip, this.filters.take)
      return
    }
    console.log(this.filters)
    this.getProductsByFilter()
  }

  
  getProductsByFilter() {
    this.computerSevice.getComputers(this.filters)
    .subscribe((resp: ComputerDTO) => {
      if (Array.isArray(this.computers) && this.computers.length) {
        this.productsState.resultCount = resp.count
        this.computers.splice(0, this.computers.length)
        resp.computers.forEach(computer => this.computers.push(computer))
      } else {
        this.productsState.resultCount = resp.count
        this.computers = resp.computers
      }
      console.log(this.computers)
    })
  }

  getProductsOnScroll() {
    console.log('#1 scroll with filter fires()')
    if (this.computers.length < this.pageSize) {
      return
    }
    this.onScrollPaginationCounter++;
    
    this.route.queryParams.subscribe((queryParams) => {
      if (!this.filters.filter.length && !queryParams.q && !queryParams.c ) {
        console.log('api without filters', queryParams)
        const skip = (this.onScrollPaginationCounter - 1) * this.pageSize;
        this.productsState.loading = true;
        this.computerSevice.getAllComputers(skip, this.pageSize)
        .subscribe((computers) => {
          computers.forEach((computer, i, self) => {
            this.computers.push(computer)
            this.productsState.loading = false
            this.productsState.loaded = true
          })
        });
      } else {
        console.log('scroll with filter fires()')
        this.filters.skip = (this.onScrollPaginationCounter - 1 ) * this.pageSize
        this.filters.take = this.pageSize
        this.computerSevice.getComputers(this.filters)
        .subscribe((resp) => {
          this.productsState.resultCount = resp.count
          resp.computers.forEach(computer => {
            this.computers.push(computer)
          })
        })
      }
    })
    
  }

  // Validation Fn for search free text
  atLeastOneRequired(g: AbstractControl): ValidationErrors | null {
    const product = g.get('text').value,
              company = g.get('Company').value
    if (!product && !company) {
      return {atLeastOneRequired: true}
    }
    return null
  }

}
