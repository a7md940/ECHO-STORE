import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ActivationEnd, Scroll, ActivatedRouteSnapshot } from '@angular/router';
import { RouterService } from 'src/app/core/services/router.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  urlSegmants: Array<any>;

  constructor(
    private routerService: RouterService,
    public router: Router
  ) { }

  ngOnInit() {
    this.routerService.routerState$.pipe(distinctUntilChanged()).subscribe(shanpShot => {
      const urls = shanpShot.root.children.map(shot => shot.url.map(u => u.path))
      this.urlSegmants = urls
      console.log('URL Segmants: ', this.urlSegmants.join())
    });
  }

}
