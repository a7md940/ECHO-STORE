import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { filterTypes } from 'src/app/shared/models/enums/filter-types';
import { filterLogic } from 'src/app/shared/models/enums/filter-logic';
import { ComputerFilter, Filter } from 'src/app/shared/models/computer-filter';
import { EventBuss } from 'src/app/core/services/event.buss.service';
import { NgForm, NgModel } from '@angular/forms';
import { ProcessorsService } from './../../core/services/processors.service';
import { InchesService } from './../../core/services/inches.service';
interface FilterType {
  name: string;
  type: filterTypes,
  controls: any;
  model: NgModel
}
@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit {
  @ViewChild('filterForm') filterForm: NgForm;
  filters: Array<FilterType> = [
    {
      name: 'Price',
      type: filterTypes.range,
      controls: {
        min: 10,
        max: 10000
      },
      model: null
    },
    {
      name: 'ram_cap',
      type: filterTypes.checkbox,
      controls: [8, 6, 4, 12, 14, 16],
      model: null
    },
    {
      name: 'OpSys',
      type: filterTypes.checkbox,
      controls: ["macOS", "Windows 10", "Mac OS X", "Linux"],
      model: null
    },
    {
      name: 'cpu_cores',
      type: filterTypes.checkbox,
      controls: ["i7", "i5", "i3"],
      model: null
    },
    {
      name: 'Inches',
      type: filterTypes.checkbox,
      controls: [13.3, 15.6, 16.8, 21, 30],
      model: null
    }
  ]

  @Output() filterValue = new EventEmitter();
  filterQuery: Array<Filter> = [];
  constructor(
    private eBuss: EventBuss,
    private processorsService: ProcessorsService,
    private inchesService: InchesService
  ) { }

  ngOnInit() {
    this.eBuss.on('searchTextTrigger').subscribe((e) => {
      this.filterForm.reset()
      console.log(this.filterForm)
    })
    this.getProcessorsFilters()
    this.getInchesFilters()
  }

  private getInchesFilters() {
    this.inchesService.getInches().subscribe((inches) => {
      this.filters.find(x => x.name == 'Inches').controls = inches.map(x => x.Inches)
      console.log({inches})
    })
  }
  getProcessorsFilters() {
    this.processorsService.getProcessors().subscribe((processors: Array<any>) => {
      console.log(processors)
      const cpuFilter = this.filters.find(x => x.name == 'cpu_cores')

      cpuFilter.controls = processors.map( x => ({family: x.family, id: x._id}) )
      console.log(cpuFilter)
    })
  }

  setFilter(e, filterName: string, value: any) {
    // console.log(filterName, value);
    console.log({value})
    // Handle Uncheck Filter
    const sameFilterToRemove = this.filterQuery.find(x => x.value == value);
    if (sameFilterToRemove) {
      this.filterQuery = this.filterQuery.filter(x => x.value != value);
      const siblings: Array<any> = this.filterQuery.filter(x => x.field == sameFilterToRemove.field);
      if (siblings.length == 1) {
        this.filterQuery.find(x => x.value == siblings[0].value).logic = null;
      }
      this.filterValue.emit(this.filterQuery);
      // console.table(this.filterQuery);
      return;
    }

    // Handle Logic [or || and]
    const siblingFilter = this.filterQuery.find(x => x.field == filterName);
    if (siblingFilter) {
      siblingFilter.logic = filterLogic.or;
      this.filterQuery.push({
        field: filterName,
        value,
        operator: null,
        logic: filterLogic.or
      })
    } else {
      this.filterQuery.push({
        field: filterName,
        value,
        operator: null,
        logic: null
      });
    }
    this.filterValue.emit(this.filterQuery);
    // console.table(this.filterQuery);
  }

}
