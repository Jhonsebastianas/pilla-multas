import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class PhoneDTO {
  @IsNotEmpty({ message: 'El número de contacto es obligatorio' })
  @Transform((value) => value.value.trim().toLowerCase())
  value: string;

  @Transform((callsign) => callsign.value.trim().toLowerCase())
  callsign: string;
}

export class ContactDTO {
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @Transform((email) => email.value.trim().toLowerCase())
  email: string;

  @IsOptional()
  @ValidateNested()
  phone: PhoneDTO;

  @IsOptional()
  @ValidateNested()
  cellular: PhoneDTO;
}
