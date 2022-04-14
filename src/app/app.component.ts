import {Component, OnInit} from '@angular/core';
import {IData} from "./models/data";
import {DataService} from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'project';
  data: IData[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data: IData[]) => {
      this.data = data;
      console.log(this.data);
    });
  }
}
