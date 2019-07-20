import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  searchText
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      if (queryParams.q) {
        this.searchText = queryParams.q
      } else {
        this.searchText = ''
      }

      if (queryParams.c) {
        this.searchText = queryParams.c
      } else {
        this.searchText = ''
      }
    })

  }
  
  search(formValue) {
    this.router.navigate([`/products`],{
      queryParams: { c: formValue.searchText}
    })
  }
}
