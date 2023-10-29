import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { AuthService as AuthServiceInterface } from './auth-service.interface.js';
import { LoginUserDto, UserEntity, UserService } from '../user/index.js';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.const.js';
import { Component } from '../../shared/types/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { TokenPayload } from '../../shared/types/token-payload.js';

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) { }

  public async authenticate({ id, name, email }: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = { email, name, id };

    this.logger.info(`Create token for ${email}`);

    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
