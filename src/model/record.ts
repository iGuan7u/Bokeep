import { CostType } from "./type";

import dayjs from 'dayjs';

export default class CostRecord {
  id: string;
  name: string;
  price: number;
  costType: CostType;
  spendTime: number;
  createTime: number;
  creator: string;
  remarks?: string;

  constructor(
    name: string,
    price: number,
    spendTime: number,
    costType: CostType,
    creator: string,
    remarks?: string,
    id: string = crypto.randomUUID(),
    createTime = Date.now()
  ) {
    this.name = name;
    this.price = price;
    this.spendTime = spendTime;
    this.costType = costType;
    this.id = id;
    this.remarks = remarks;
    this.creator = creator;
    this.createTime = createTime;
  }

  static create(jsonObject: object): CostRecord {
    const name = jsonObject["name"] as string;
    const price = Number(jsonObject["price"] as string);
    let spendTime = dayjs(jsonObject["spendTime"] as string, 'MM/DD/YYYY').toDate().getTime();
    const nowDay = dayjs();
    const previousStartTime = nowDay.startOf('day').valueOf();
    const previousTimeInterval = nowDay.valueOf() - previousStartTime;
    spendTime += previousTimeInterval;
    const costType = Number(jsonObject["costType"]);
    const remarks = jsonObject["remarks"] as string;
    return new CostRecord(name, price, spendTime, costType, "Sid", remarks);
  }

  static parse(dbObject: any): CostRecord {
    return new CostRecord(
      dbObject.name,
      dbObject.price,
      dbObject.spendTime,
      dbObject.costType,
      dbObject.creator,
      dbObject.remarks,
      dbObject.id,
      dbObject.createTime,
    );
  }

  static update = (record: CostRecord, jsonObject: object) => {
    const name = jsonObject["name"] as string;
    const price = Number(jsonObject["price"] as string);
    let spendTime = dayjs(jsonObject["spendTime"] as string, 'MM/DD/YYYY').toDate().getTime();
    if (record.spendTime != 0) {
      const previousDate = dayjs(record.spendTime);
      const previousStartTime = previousDate.startOf('day').valueOf();
      const previousTimeInterval = record.spendTime - previousStartTime;
      spendTime += previousTimeInterval;
    }
    const costType = Number(jsonObject["costType"]);
    record.name = name;
    record.price = price;
    record.spendTime = spendTime;
    record.costType = costType;
    const remarks = jsonObject["remarks"] as string;
    if (remarks != null) {
      record.remarks = remarks;
    }
  }

  static clone = (record: CostRecord) => {
    return new CostRecord(
      record.name,
      record.price,
      record.spendTime,
      record.costType,
      record.creator,
      record.remarks,
      record.id,
      record.createTime,
    );
  }
}