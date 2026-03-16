import { IsNumber, IsEmail, IsString, IsOptional } from 'class-validator';

export class WithdrawDto {

    @IsNumber()
    amount: number;

    @IsEmail()
    email: string;

    @IsString()
    securityQuestion: string;

    @IsString()
    securityAnswer: string;

    @IsOptional()
    @IsString()
    message?: string;
}