export class RegisterDto {
  username: string
  email: string
  password: string
}

export class LoginDto {
  email: string
  password: string
}

export class ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

export class ForgotPasswordDto {
  email: string
}

export class ResetPasswordDto {
  token: string
  newPassword: string
}
