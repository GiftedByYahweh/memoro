export interface AuthUserDto {
  readonly id: string;
  readonly email: string;
  readonly createdAt: string;
}

export interface AuthSessionDto {
  readonly user: AuthUserDto;
}

export interface RegisterDto {
  readonly email: string;
  readonly password: string;
}

export interface LoginDto {
  readonly email: string;
  readonly password: string;
}
