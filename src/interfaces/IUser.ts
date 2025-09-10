export interface IUser {
  userName: string;
  password: string;
}

export interface IUserCreationResponse {
  userID: string;
  username: string;
  books: any[];
}
