import { Component, OnInit } from '@angular/core';
import { ComputerService } from './core/services/computer.service';
import { ComputerFilter } from 'src/app/shared/models/computer-filter';
import { filterLogic } from './shared/models/enums/filter-logic';
import { filterOperator } from './shared/models/enums/operators.filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  computers$;
  constructor(
    private cmService: ComputerService
  ) {
  }

  ngOnInit() {
    const query: ComputerFilter = {
      filter: [
        {
          field: 'Company',
          value: 'HP',
          logic: filterLogic.or,
          operator: null
        },
        {
          field: 'Company',
          value: 'Lenovo',
          logic: filterLogic.or,
          operator: null
        }
      ],
      skip: 10,
      take: 10,
      filterLogic: filterLogic.or
    };
    this.computers$ = this.cmService.getComputers(query);
  }
}
