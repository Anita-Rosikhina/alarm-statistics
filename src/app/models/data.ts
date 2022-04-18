import {EStatus} from "../enums/status";

export interface IData {
  statusType: EStatus
  tag: string
  date: string
}

export interface IRegion {
  days: IDay[]
  period: string
  times: number
}

export interface IDay {
  period: string
  times: number
  alertPeriods: IAlert[]
}

export interface IAlert {
  startTime: string
  endTime: string
  period: string
}
