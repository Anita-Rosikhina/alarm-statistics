import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {IData} from "../models/data";
import {EStatus} from "../enums/status";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) {}

  getData(): Observable<IData[]> {
    return this.httpClient.get('assets/data.txt', {responseType: 'text'})
      .pipe(
        map(data => data.split('\r\n\r\n')),
        map(data => data.map(el => {
          return {
            statusType: el.includes('Відбій') ? EStatus.End : EStatus.Start,
            date: el.slice(el.indexOf('[') + 1, el.indexOf(']')),
            tag: el.slice(el.indexOf('#'))
          }
        })),
      )
  }
}
