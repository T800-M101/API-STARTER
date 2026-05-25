import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in the environment variables');
    }
    super({
      // Extract the token from the body (where the refresh token is usually sent)
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: secret, 
      passReqToCallback: true, 
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.body.refreshToken;
    return { ...payload, refreshToken };
  }
}