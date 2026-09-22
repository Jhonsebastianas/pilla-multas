export class ResponseRedirectDTO {
  url: string;
  statusCode: number;
}

export class ResponseRedirectDtoBuilder {
  private readonly _responseRedirectDTO: ResponseRedirectDTO;

  constructor() {
    this._responseRedirectDTO = {
      url: null,
      statusCode: null,
    };
  }

  whitUrl(url: string): ResponseRedirectDtoBuilder {
    this._responseRedirectDTO.url = url;
    return this;
  }

  whitStatusCode(statusCode: number): ResponseRedirectDtoBuilder {
    this._responseRedirectDTO.statusCode = statusCode;
    return this;
  }

  build(): ResponseRedirectDTO {
    return this._responseRedirectDTO;
  }
}
