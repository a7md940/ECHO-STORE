import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { InchesFilters } from './../../shared/models/filters.models';

@Injectable({
  providedIn: 'root'
})
export class InchesService {

  constructor(
    private http: HttpClient
  ) { }

  getInches() {
    return this.http.get<Array<InchesFilters>>(`${environment.url}/inches/all`)
  }
}
