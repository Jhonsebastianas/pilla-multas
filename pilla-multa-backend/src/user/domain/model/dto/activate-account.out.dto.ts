import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ActivateAccountOutDTO {
  @IsNotEmpty({ message: 'El campo correo es obligatorio' })
  @Transform((email) => email.value.trim().toLowerCase())
  @ApiProperty({
    description: 'Correo electrónico',
    example: 'user@example.com',
  })
  email: string;

  @IsNotEmpty({ message: 'El campo token es obligatorio' })
  @ApiProperty({ description: 'Token de acceso', example: 'token' })
  token: string;

  @IsNotEmpty({ message: 'El campo codigo otp es obligatorio' })
  @ApiProperty({ description: 'Codigo otp', example: '0000' })
  code: string;
}
