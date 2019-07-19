import { Component, OnInit } from '@angular/core';
import { ComputerService } from './core/services/computer.service';
import { ComputerFilter } from 'src/app/shared/models/computer-filter';
import { filterLogic } from './shared/models/enums/filter-logic';
import { filterOperator } from './shared/models/enums/operators.filter';
import { Router, RouterEvent, Event } from '@angular/router';
import { RouterService } from './core/services/router.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  computers$;
  constructor(
    private cmService: ComputerService,
    private router: Router,
    private routerService: RouterService
  ) {
  }

  ngOnInit() {
    this.router.events.subscribe((e:  Event) => this.routerService.routerState$.next(this.router.routerState.snapshot))
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
       },
      ],
      skip: 10,
      take: 10,
      filterLogic: filterLogic.or
    };
    this.computers$ = this.cmService.getComputers(query);
  }
}
