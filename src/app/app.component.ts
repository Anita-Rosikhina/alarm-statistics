import {Component, OnInit} from '@angular/core';
import {IData} from "./models/data";
import {DataService} from "./services/data.service";
import {EStatus} from "./enums/status";
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project';
  data: IData[] = [];
  tags: string[] = [];
  statistic: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data: IData[]) => {
      this.data = data;
      this.generateTags();
      this.generateStatistics();
    });
  }

  generateTags(): void {
    this.tags = this.data.map(el => el.tag);
  }

  generateStatistics(): void {
    this.tags.forEach(tag => {
      const filteredDataByTag = this.data.filter(el => el.tag === tag);
      this.statistic = {
        [tag]: {
          times: this.data.filter(el => el.tag === tag && el.statusType === EStatus.Start).length,
          duration: this.generalDuration(filteredDataByTag),
          averageDuration: this.averageDuration(filteredDataByTag),
        },
        ...this.statistic
      }
    });
    console.log(this.statistic)
  }

  getDurations(alerts: IData[]) : number[] {
    let endDate: string | null;
    let durations: number[] = [];
    _.forEachRight(alerts, alert => {
      if (alert.statusType === EStatus.Start) {
        const duration = moment(endDate)?.diff(alert.date, 'minutes');
        durations = [...durations, duration]
        endDate = null;
      } else {
        endDate = alert.date
      }
    })
    return durations;
  }

  generalDuration(alerts: IData[]): number {
    return _.sum(this.getDurations(alerts));
  }

  averageDuration(alerts: IData[]): number {
    return _.meanBy(this.getDurations(alerts), (d) => d);
  }
}
