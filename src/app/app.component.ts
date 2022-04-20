import {Component, OnInit} from '@angular/core';
import {IAlert, IData, IDay, IRegion} from "./models/data";
import {DataService} from "./services/data.service";
import * as _ from 'lodash';
import * as moment from 'moment';
import {EStatus} from "./enums/status";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: IData[] = [];
  statistics: IRegion[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data: IData[]) => {
      this.data = data;
      this.generateStatistics();
    });
  }

  private generateStatistics(): void {
    const groupedArrayByTag = _.toArray(_.groupBy(this.data, 'tag'));
    this.statistics = groupedArrayByTag.map(el => ({
      tag: this.generateTag(el),
      days: this.generateDays(el),
      duration: _.sumBy(this.generateDays(el), 'duration'),
      times: Math.ceil(el.length / 2)
    }))
    console.log('statistics', this.statistics);
  }

  private generateTag(data: IData[]): string {
    let tags = _.groupBy(data, 'tag')
    return Object.keys(tags)[0]
  }

  private generateDays(data: IData[]): IDay[] {
    return _.toArray(_.groupBy(data, 'date')).map(el => ({
      times: Math.ceil(el.length / 2),
      duration: this.calcDuration(el),
      alerts: this.generateAlerts(el)
    }));
  }

  private calcDuration(data: IData[]): number {
    let durations: number[] = [];
    let startTime = '';
    data.forEach(el => {
      if (el.statusType === EStatus.End) {
        durations.push(moment(el.fullDate).diff(moment(startTime), 'minutes', true));
        startTime = ''
      } else {
        startTime = el.fullDate
      }
    })
    return _.sum(durations);
  }

  private generateAlerts(data: IData[]): IAlert[] {
    let alerts: IAlert[] = [];
    let startTime = '';
    data.forEach(el => {
      if (el.statusType === EStatus.End) {
        alerts.push({
          startTime,
          endTime: el.fullDate,
          duration: moment(el.fullDate).diff(moment(startTime), 'minutes', true)
        })
      } else {
        startTime = el.fullDate
      }
    })
    return alerts;
  }
}
