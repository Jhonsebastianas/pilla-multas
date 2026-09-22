import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO {
  @ApiProperty({ description: 'Código de estado', example: 200 })
  statusCode: number;

  @ApiProperty({
    description: 'Mensaje de la respuesta',
    example: 'Resultado éxitoso',
  })
  message: string;

  @ApiProperty({
    description: 'Información adicional en la respuesta',
    example: 'data',
  })
  data: any;

  /**
   *
   * @param statusCode código de estado de la petición.
   * @param message mensaje personalizado.
   * @param data información a devolver.
   */
  constructor(statusCode: number, message: string, data: any = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class ResponseDtoBuilder {
  private readonly _responseDTO: ResponseDTO;

  constructor() {
    this._responseDTO = {
      statusCode: null,
      message: '',
      data: null,
    };
  }

  whitStatusCode(statusCode: number): ResponseDtoBuilder {
    this._responseDTO.statusCode = statusCode;
    return this;
  }

  whitMessage(message: string): ResponseDtoBuilder {
    this._responseDTO.message = message;
    return this;
  }

  whitData(data: any): ResponseDtoBuilder {
    this._responseDTO.data = data;
    return this;
  }

  ok(): ResponseDtoBuilder {
    HttpCode(HttpStatus.OK);
    this._responseDTO.statusCode = HttpStatus.OK;
    return this;
  }

  conflict(): ResponseDtoBuilder {
    HttpCode(HttpStatus.CONFLICT);
    this._responseDTO.statusCode = HttpStatus.CONFLICT;
    return this;
  }

  created(info?: any): ResponseDtoBuilder {
    HttpCode(HttpStatus.CREATED);
    this._responseDTO.statusCode = HttpStatus.CREATED;
    this._responseDTO.data = info;
    return this;
  }

  noContent(): ResponseDtoBuilder {
    HttpCode(HttpStatus.NO_CONTENT);
    this._responseDTO.statusCode = HttpStatus.NO_CONTENT;
    return this;
  }

  build(): ResponseDTO {
    return this._responseDTO;
  }
}
