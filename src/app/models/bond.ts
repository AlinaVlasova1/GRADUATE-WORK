export type StringOrNumber = string | number;
export type KeysAndValues = string | StringOrNumber;
export type ObjectfromKAndV = KeysAndValues[];
export type DataFromServer = StringOrNumber[];
export interface ISecurities {
  metadata: any,
  columns: string[],
  data:DataFromServer[]

}
export interface IBond {
  securities: ISecurities
}

export interface IBondTransform {
  SECID: string,
  COUPONVALUE: number,
  NEXTCOUPON: string,
  PREVPRICE: number,
  LOTSIZE: number,
  PREVDATE: string,
  SETTLEDATE: string,
  EMITENT: string,
  MATDATE: string
}
