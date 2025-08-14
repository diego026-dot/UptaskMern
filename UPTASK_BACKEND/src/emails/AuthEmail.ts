import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        await transporter.sendMail({
            from: 'Uptasl <admin@uptask.com>',
            to: user.email,
            subject: 'Comfirmar Cuenta',
            text: 'Uptask - Confirma tu cuenta',
            html: `<p> Hola ${user.name} has creado tu cuenta en uptask, ya esta casi todo
                listo solo debes de confirmar tu cuenta </p>
                <p>Solo debes de confirmar tu cuenta</p>
                <a href="">Confirmar cuenta</a>
                <p>Ingresa el codigo: <b>${user.token}</b></p>
            
            `
        })
    }
}