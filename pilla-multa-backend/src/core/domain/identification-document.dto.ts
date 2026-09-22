import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { TypeIdentificationDTO } from './tipo-identificacion.dto';

export class IdentificationDocumentDTO {
  @IsNotEmpty({ message: 'El campo número de identificación es obligatorio' })
  @Transform((value) => value.value.toLowerCase())
  @ApiProperty({
    description: 'Número de identificación del cliente',
    example: '1109888767',
  })
  value: string;

  @IsNotEmpty({ message: 'El campo tipo de identificación es obligatorio' })
  @Transform((type) => type.value.toLowerCase())
  @ApiProperty({
    description: 'Tipo de identificación del cliente',
    example: 'Cédula de ciudadanía',
  })
  @ValidateNested()
  type: TypeIdentificationDTO;
}
