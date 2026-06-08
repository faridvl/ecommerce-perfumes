import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRepo } from '@/shared/api/repositories/auth.repo';
import { LoginCredentials, LoginResponse, User } from '@/types/auth/auth';

const JWT_EXPIRES_IN = '8h';

interface JwtTokenPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const AuthService = {
  login: async ({ email, password }: LoginCredentials): Promise<LoginResponse> => {
    const userWithPassword = await AuthRepo.findByEmail(email);
    if (!userWithPassword) throw new Error('Credenciales incorrectas');

    const passwordIsValid = await bcrypt.compare(password, userWithPassword.password);
    if (!passwordIsValid) throw new Error('Credenciales incorrectas');

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET no configurado');

    const { password: _removedPassword, ...authenticatedUser } = userWithPassword;

    const accessToken = jwt.sign(
      { sub: authenticatedUser.id, email: authenticatedUser.email, role: authenticatedUser.role },
      jwtSecret,
      { expiresIn: JWT_EXPIRES_IN },
    );

    return { accessToken, userName: authenticatedUser.fullName };
  },

  verifyToken: (bearerToken: string): JwtTokenPayload => {
    const jwtSecret = process.env.JWT_SECRET!;
    return jwt.verify(bearerToken, jwtSecret) as JwtTokenPayload;
  },

  getUserFromToken: async (bearerToken: string): Promise<User> => {
    const tokenPayload = AuthService.verifyToken(bearerToken);
    const userWithPassword = await AuthRepo.findByEmail(tokenPayload.email);
    if (!userWithPassword) throw new Error('Usuario no encontrado');
    const { password: _removedPassword, ...authenticatedUser } = userWithPassword;
    return authenticatedUser;
  },
};
