import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { transporter } from "../config/nodemailer"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            //Prevenir que el usuario exista
            const userExists = await User.findOne({ email })
            if (userExists) {
                const error = new Error("El usuario ya existe")
                res.status(409).json({ error: error.message })
                return
            }

            //Crear un usuario
            const user = new User(req.body)
            user.password = await hashPassword(password)

            //Generar un token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Enviar email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send('Cuenta creada, revisa tu email para confrimarala')

        } catch (error) {
            res.status(500).json({ error: "Hubo un error" })
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            //Validando que exista el token
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                const error = new Error("El token no existe")
                res.status(404).json({ error: error.message })
                return
            }

            //Encontrando el usuario
            const user = await User.findById(tokenExists.user)
            user.confirmed = true

            Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send("Cuenta Confirmada")



        } catch (error) {
            res.status(500).json({ error: "Hubo un error" })
        }

    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
            if (!user) {
                const error = Error("El usuario no existe")
                res.status(404).json({ erorr: error.message })
                return
            }

            if (!user.confirmed) {
                //Generar un token
                const token = new Token()
                token.token = generateToken()
                token.user = user.id
                await token.save()

                //Enviar email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = Error("La cuenta aun no ha sido confirmada, se a reenviado un email de confirmacion")
                res.status(401).json({ erorr: error.message })
                return
            }

            const passwordCorrect = checkPassword(password, user.password)
            if(!passwordCorrect){
                const error = Error("Passwrod incorrecto")
                res.status(401).json({ erorr: error.message })
                return
            }

            res.send('Autenticado')


        } catch (error) {
            res.status(500).json({ error: "Hubo un error" })
        }

    }
}