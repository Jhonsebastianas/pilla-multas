import { Controller, Get, Query, Res, Sse } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import { UserServiceImpl } from '../application/user-service.impl';

@Controller('activate-account')
@ApiTags('activate-account')
export class AccountActivationController {
  constructor(
    private userService: UserServiceImpl,
  ) {}

  @Sse('activation')
  activationStream(@Query('token') token: string) {
    return this.userService.verifyAccountActivation(token);
  }

  @Get()
  @ApiOperation({
    description:
      'Activa la cuenta del usuario mediante un token enviado por correo',
  })
  async activateAccount(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.userService.activateAccount(token);

      // Simple HTML response since emailService was removed
      const appName = 'Pilla Multa';
      const html = `
        <html>
          <head><title>Cuenta Activada</title></head>
          <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>¡Cuenta Activada!</h1>
            <p>Tu cuenta en ${appName} ha sido activada con éxito. Ya puedes cerrar esta ventana.</p>
          </body>
        </html>
      `;

      res.send(html);
    } catch (error) {
      res.status(400).send(`
               <html>
                 <body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial,sans-serif;background-color:#f4f4f4;">
                   <div style="background:white;padding:40px;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);text-align:center;">
                     <h2 style="color:#e74c3c;">Error en la activación</h2>
                     <p style="color:#555;">${error.message || 'El enlace de activación es inválido o ha expirado.'}</p>
                   </div>
                 </body>
               </html>
           `);
    }
  }
}
