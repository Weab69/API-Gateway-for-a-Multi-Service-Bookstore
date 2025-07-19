import { Request } from 'express';
import { IUser } from '../models/userModel';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

declare global {
  namespace Express {
    export interface User extends IUser {}
  }
}

export interface IRequestWithUser extends Request {
  user?: IUser;
}