import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { filterTypes } from 'src/app/shared/models/enums/filter-types';
import { filterLogic } from 'src/app/shared/models/enums/filter-logic';
import { ComputerFilter, Filter } from 'src/app/shared/models/computer-filter';
interface FilterType {
  name: string;
  type: filterTypes,
  controls: any;
}
@Component({
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss']
})
export class FilterSidebarComponent implements OnInit {
  filters: Array<FilterType> = [
    {
      name: 'Price',
      type: filterTypes.range,
      controls: {
        min: 10,
        max: 10000
      }
    },
    {
      name: 'RAM',
      type: filterTypes.checkbox,
      controls: [8, 6, 4, 12, 14, 16].map(x => x.toString()),
    },
    {
      name: 'OpSys',
      type: filterTypes.checkbox,
      controls: ["macOS", "Windows 10", "Mac OS X", "Linux"],
    },
    {
      name: 'CPU',
      type: filterTypes.checkbox,
      controls: ["i7", "i5", "i3"],
    },
    {
      name: 'inches',
      type: filterTypes.checkbox,
      controls: [13.3, 15.6, 16.8, 21, 30],
    }
  ]

  @Output() filterValue = new EventEmitter();
  filterQuery: Array<Filter> = [];
  constructor() { }

  ngOnInit() {
  }

  getFilter(e, filterName: string, value) {
    // console.log(filterName, value);
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
