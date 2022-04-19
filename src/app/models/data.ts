import {EStatus} from "../enums/status";

export interface IData {
  statusType: EStatus
  tag: string
  fullDate: string
  date: string
}

export interface IRegion {
  tag: string
  days: IDay[]
  duration: number
  times: number
}

export interface IDay {
  times: number
  duration: number
  alerts: IAlert[]
}

export interface IAlert {
  startTime: string
  endTime: string
  duration: number
}
