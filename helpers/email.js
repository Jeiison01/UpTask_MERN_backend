import nodemailer from 'nodemailer'

export const emailRegistro =async (datos) => {
    const {email, nombre, token} = datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      //Informacion del email

      const info = await transport.sendMail({
          from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
          to: email,
          subject: "UpTask - Comprueba tu cuenta",
          text:"Compueba tu cuenta en UpTask",
          html:`<p>Hola: ${nombre} Comprueba tu cuenta en UpTask </p>

          <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>

          <a href="${process.env.FRONTEND_URL}/confirm/${token}">Click Aquí Para Comprobar Cuenta</a>

          <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
          `
      })
}

export const emailOlvidePassword =async (datos) => {
  const {email, nombre, token} = datos;


  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    //Informacion del email

    const info = await transport.sendMail({
        from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "UpTask - Restablece tu Password",
        text:"Compueba tu cuenta en UpTask",
        html:`<p>Hola: ${nombre} has solicitado restablecer tu password </p>

        <p>Haz click en el siguiente enlace para generar un nuevo password:</p>

        <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Restablecer Password</a>

        <p>Si tu no solicitaste esto, puedes ignorar el mensaje</p>
        `
    })
}