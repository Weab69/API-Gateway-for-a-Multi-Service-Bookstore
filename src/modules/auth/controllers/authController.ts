import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { MongoUserRepository } from '../repositories/userRepository';

const userRepository = new MongoUserRepository();
const authService = new AuthService(userRepository);

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.signup({ email, password });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    res.status(201).json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(400).json({ message: 'Error signing up', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const tokens = await authService.login({ email, password });

    if (!tokens) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error });
  }
};

export const refresh = (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }

  const decoded = authService.verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  const tokens = authService.generateTokens(decoded);

  res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
  res.json({ accessToken: tokens.accessToken });
};
