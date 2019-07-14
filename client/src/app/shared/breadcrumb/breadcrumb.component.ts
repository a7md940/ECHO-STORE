import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  urlSegmants: Array<any>;

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    this.router.events.subscribe(events => {
      if (events instanceof ActivationEnd) {
        this.urlSegmants = events.snapshot.url.map(url => url.path);
      }
    });
  }

}
