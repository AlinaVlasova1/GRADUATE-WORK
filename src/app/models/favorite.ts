export interface IFavorite {
  SECID: string,
  userId: string
}

export interface IFavoriteFromServer {
  SECID: string,
  COUPONVALUE: number,
  PREVPRICE: number,
}
