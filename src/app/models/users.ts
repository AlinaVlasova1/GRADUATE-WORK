export interface IUser {
  login: string,
  email?: string,
  password?: string,
  cardNumber?: string,
  id: string,
}

export const TOKEN_STORE_NAME = 'token';
