import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ComputerFilter } from 'src/app/shared/models/computer-filter';
import { Computer, ComputerDTO } from 'src/app/shared/models/computer';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {

  constructor(
    private http: HttpClient
  ) { }

  getComputers(queryFilter: ComputerFilter) {
    return this.http.post<ComputerDTO>(`${environment.url}/computers`, queryFilter);
  }

  getAllComputers(skip: number, take: number) {
    return this.http.get<Array<Computer>>(`${environment.url}/computers?skip=${skip}&take=${take}`);
  }
}
