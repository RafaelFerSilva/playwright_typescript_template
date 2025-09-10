import { IUser, IUserCreationResponse } from "@interfaces/IUser";

export interface IAccountApiPort {
  createUser(user: IUser): Promise<IUserCreationResponse>;
}
