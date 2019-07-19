import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessorsService {

  constructor(
    private http: HttpClient
  ) { }

  getProcessors() {
    return this.http.get(`${environment.url}/processors`)
  }
}
