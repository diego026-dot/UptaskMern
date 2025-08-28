import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
    namespace Express {
        interface Request{
            user?: IUser
        }
    }
}

export const authenticate = async (req : Request,res : Response,next: NextFunction) => {
    const bearer  = req.headers.authorization
    if(!bearer){
        const error = new Error('No autorizado')
        res.status(401).json({error: error.message})
    }

    const token = bearer.split(' ')[1]

    try {

        const decoded = jwt.verify(token, 'palabrasupersecreta')

        if(typeof decoded === 'object' && decoded.id){
           const user = await User.findById(decoded.id).select('-password -confirmed') 
           if(user){
                req.user = user
                 next()
           }else{
                res.status(500).json({error: 'Token no valido'})
           }
        }
        
        
    } catch (error) {
        res.status(500).json({error: 'Token no valido'})
    }

   
}