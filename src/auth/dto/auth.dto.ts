import { IsEmail, IsOptional, IsString, IsUrl, MinLength } from "class-validator"

export class AuthDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(6, {
        message: "Password must be at latest 6 characters long"
    })
    password: string
}

export class RegisterDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(6, {
        message: "Password must be at latest 6 characters long"
    })
    password: string

    @IsOptional()
    @IsUrl()
    userAvatar: string
}