import { MongoUserRepository } from "../repositories/userRepository";
import { IUser, IUserLogin } from "../models/userModel";
import { ITokens } from "../types/auth.types";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import dotenv from 'dotenv';

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(private userRepository: MongoUserRepository) {
    dotenv.config();

    this.jwtSecret = process.env.JWT_SECRET!;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
  }

  async signup(userData: Partial<IUser>): Promise<ITokens> {
    const user = await this.userRepository.create(userData);
    return this.generateTokens(user);
  }

  async login(userData: IUserLogin): Promise<ITokens | null> {
    const user = await this.userRepository.findByEmail(userData.email);
    if (!user || !user.password) {
      return null;
    }

    const isMatch = await user.comparePassword(userData.password);
    if (!isMatch) {
      return null;
    }

    return this.generateTokens(user);
  }

  generateTokens(user: IUser): ITokens {
    const payload = { id: (user._id as Types.ObjectId).toString(), email: user.email };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRATION || '15m') as any,
    });

    const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRATION || '7d') as any,
    });

    return { accessToken, refreshToken };
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtRefreshSecret);
    } catch (error) {
      return null;
    }
  }
}