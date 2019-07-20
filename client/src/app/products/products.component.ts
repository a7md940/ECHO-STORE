import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ComputerService } from './../core/services/computer.service';
import { ComputerFilter, Filter } from 'src/app/shared/models/computer-filter';
import { filterLogic } from 'src/app/shared/models/enums/filter-logic';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { EventBuss } from '../core/services/event.buss.service';
import { skipWhile, takeWhile, takeUntil } from 'rxjs/operators'
import { ComputerDTO } from '../shared/models/computer';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  computers: Array<any>;
  pageSize = 12;
  onScrollPaginationCounter = 1;

  stopOnScrollQueryParamsListener = new Subject()
  destroyObs$ = new Subject()

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
  processors: Array<{family: string; _id: string;}>
  searchTags: Array<any> = []
  constructor(
    private computerSevice: ComputerService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private eBuss: EventBuss,
    private router: Router
  ) { }

  private resetSearchCriteria() {
    this.filters.filter = []
    this.filters.filterLogic = null
    this.filters.skip = 0
    this.filters.take = this.pageSize

    this.stopOnScrollQueryParamsListener.next(false)
    this.stopOnScrollQueryParamsListener.complete()
  }
  ngOnInit() {
    this.buildSearchForm()
    this.getProcessorsForSearchTags()

    this.route.queryParams.subscribe(query => {
      if (query) {
        this.resetSearchCriteria()
        
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
      
    this.getAllComputers()
  }

  private getProcessorsForSearchTags() {
    this.eBuss.on('getCPUS').pipe(takeUntil(this.destroyObs$) ).subscribe((processors) => {
      this.processors = processors
    })
  }

  getAllComputers() {
    this.route.queryParams.pipe(takeUntil(this.stopOnScrollQueryParamsListener)).subscribe(query => {
      const { q, c }= query
      if (!q && !c) {
        this.productsState.loading = true;
        const skip = 0;
        this.computerSevice.getAllComputers(skip, this.pageSize)
        .subscribe((computers: Array<any>) => {
          this.computers = computers;
          this.productsState.loading = false;
          this.productsState.loaded = true;
        })
      } else {
        this.getProductsByFilter()
      }
    })
  }


  ngAfterViewInit() {
    const overlay = document.querySelector('.overlay') as HTMLDivElement
    overlay.addEventListener('click', (e) => {
      const label = document.getElementById('filter_sidebar_icon') as HTMLLabelElement
      label.click()
    })

  }

  ngOnDestroy() {
    this.destroyObs$.next(null)
    this.destroyObs$.complete()
  }


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
    const queryParams = {}
    if (text) {
      queryParams['q'] = text
    }
    if (Company) {
      queryParams['c'] = Company
    }
    
    // reassign filters array to reset filter criteria
    this.eBuss.emit('searchTextTrigger',  true)
    this.router.navigate(this.route.snapshot.url, { queryParams })
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
      this.computerSevice.getAllComputers(this.filters.skip, this.filters.take).subscribe((computers) => {
        this.computers.splice(0, this.computers.length - 1)
        computers.forEach(computer => this.computers.push(computer))
      })
      this.filters.filter = []
      this.buildFilterTags()
      return
    }
    this.getProductsByFilter()
    this.buildFilterTags()
  }

  private buildFilterTags() {
    console.log(this.filters.filter)
    this.searchTags = this.filters.filter.map((filter, i, self) => {
      const processor = this.processors.find(processor => processor._id == filter.value)

      if (processor) {
        return { value: processor.family, field: filter.field, realValue: processor._id, controlName: processor.family }
      } else if ( filter.field == 'ram_cap') {
        return { value: filter.value + 'GB', field: filter.field, realValue:filter.value, controlName: filter.value}
      } else if (filter.field == 'Inches') {
        return { value: filter.value + 'inch', field: filter.field, realValue:filter.value, controlName: filter.value }
      } else {
        return { value: filter.value, field: filter.field, realValue:filter.value, controlName: filter.value }
      }
    })
  }

  clearSearchCiteriaByTag(tag) {
    this.eBuss.emit('searchTagCleared', {tag, filters: this.filters})
    let filterObj;
    if (tag.realValue) { // it's cpu tag
      filterObj = this.filters.filter.find(x => x.value == tag.realValue)
    } else {
      filterObj = this.filters.filter.find(x => x.value == tag.value)
    }
    if (filterObj && tag.realValue) {
      this.filters.filter = this.filters.filter.filter(f => f.value !== tag.realValue)
    } else if (filterObj && !tag.realValue) {
      this.filters.filter = this.filters.filter.filter(f => f.value !== tag.value)
    }

    this.searchTags = this.searchTags.filter(t => t.value !== tag.value)

    // if (tag.realValue) {
    //   this.searchTags = this.searchTags.filter(t => t.value !== tag.realValue)
    // } else {
    //   this.searchTags = this.searchTags.filter(t => t.value !== tag.value)
    // }
    this.getProductsByFilter()
  }
  
  getProductsByFilter() {
    if (this.filters.filter.length < 2) {
      this.filters.filterLogic = null
    }
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
    })
  }

  getProductsOnScroll() {
    if (this.computers.length < this.pageSize) {
      return
    }
    this.onScrollPaginationCounter++;
    
    this.route.queryParams.pipe(takeUntil(this.stopOnScrollQueryParamsListener)).subscribe((queryParams) => {
      if (!this.filters.filter.length && !queryParams.q && !queryParams.c ) {
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
