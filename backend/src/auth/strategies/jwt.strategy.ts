import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ErrorMessage } from 'src/common/error-message';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private prisma: PrismaService,
        config: ConfigService,
      ) {
        const secret = config.get<string>('JWT_SECRET');
      
        if (!secret) {
            throw new Error(ErrorMessage.JWT_SECRET_MISSING);
        }
      
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: secret,
        });
      }

  async validate(payload: any) {
    // Payload contains: { sub: userId, email, role }
    const user = await this.prisma.user.findUnique({
      where: { userId: payload.sub },
      select: {
        userId: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is inactive');
    }

    // This will be attached to request.user
    return user;
  }
}