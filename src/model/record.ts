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

  constructor(
    name: string,
    price: number,
    spendTime: number,
    costType: CostType,
    creator: string,
    id: string = crypto.randomUUID(),
    createTime = Date.now()
  ) {
    this.name = name;
    this.price = price;
    this.spendTime = spendTime;
    this.costType = costType;
    this.id = id;
    this.creator = creator;
    this.createTime = createTime;
  }

  static create(jsonObject: object): CostRecord {
    const name = jsonObject["name"] as string;
    const price = Number(jsonObject["price"] as string);
    const spendTime = dayjs(jsonObject["spendTime"] as string, 'MM/DD/YYYY').toDate().getTime();
    const costType = Number(jsonObject["costType"]);
    return new CostRecord(name, price, spendTime, costType, "Sid");
  }

  static parse(dbObject: any): CostRecord {
    return new CostRecord(
      dbObject.name,
      dbObject.price,
      dbObject.spendTime,
      dbObject.costType,
      dbObject.creator,
      dbObject.id,
      dbObject.createTime,
    );
  }

  static update = (record: CostRecord, jsonObject: object) => {
    const name = jsonObject["name"] as string;
    const price = Number(jsonObject["price"] as string);
    const spendTime = dayjs(jsonObject["spendTime"] as string, 'MM/DD/YYYY').toDate().getTime();
    const costType = Number(jsonObject["costType"]);
    record.name = name;
    record.price = price;
    record.spendTime = spendTime;
    record.costType = costType;
  }

  static clone = (record: CostRecord) => {
    return new CostRecord(
      record.name,
      record.price,
      record.spendTime,
      record.costType,
      record.creator,
      record.id,
      record.createTime,
    );
  }
}