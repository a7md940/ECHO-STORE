import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';

export interface _Event {
  name: string;
  value: any;
}

export type EventTypes = 'clearSearchText' | 'searchTextTrigger' | 'getCPUS'
| 'searchTagCleared'
@Injectable({
    providedIn: 'root'
  })
  export class EventBuss {
    private eventBussStore$ = new Subject<_Event>()
    emit(eventName: EventTypes, value: any) {
      this.eventBussStore$.next({name: eventName, value})
    }
    on(eventName: EventTypes) {
      return this.eventBussStore$.pipe(
        filter((event: _Event) => event.name == eventName),
        map((event: _Event) => event.value)
      )
    }
  }  