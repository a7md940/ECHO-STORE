import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router,  RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  routerState$ = new BehaviorSubject<RouterStateSnapshot>(null)
  constructor() { }
}
