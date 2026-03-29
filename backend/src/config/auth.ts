import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
  type?: 'refresh';
}

export class AuthConfig {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'my-motiv-secret-key-2024';
  private static readonly JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRE,
    });
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
  }

  static decodeToken(token: string): JWTPayload | null {
    const decoded = jwt.decode(token);
    return decoded as JWTPayload | null;
  }

  static get JWT_SECRET(): string {
    return this.JWT_SECRET;
  }

  static get JWT_EXPIRE(): string {
    return this.JWT_EXPIRE;
  }
}

// Funciones para compatibilidad con código existente
export const generateToken = (payload: JWTPayload): string => {
  return AuthConfig.generateToken(payload);
};

export const verifyToken = (token: string): JWTPayload => {
  return AuthConfig.verifyToken(token);
};

export const decodeToken = (token: string): JWTPayload | null => {
  return AuthConfig.decodeToken(token);
};

export const JWT_SECRET_VALUE = process.env.JWT_SECRET || 'my-motiv-secret-key-2024';
export const JWT_EXPIRE_VALUE = process.env.JWT_EXPIRE || '7d';
