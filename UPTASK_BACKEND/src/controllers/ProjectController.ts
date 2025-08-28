import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {

    static createProject = async (req: Request , res: Response) => {

        const project = new Project(req.body)
        project.manager = req.user.id

        try {
            await project.save()
            res.send('Proyecto creado correctamente')
        } catch (error) {
            console.log(error)
        }
        
    }

    static getAllProjects = async (req: Request , res: Response) => {
        
        try {
            const data = await Project.find({
                $or: [
                    {manager: {$in: req.body.user}}
                ]
            })
            res.json(data)
            
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request , res: Response) => {
        
        const {id} = req.params
        try {
            
            const data = await Project.findById(id).populate('tasks')
            if(!data){
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error : error.message})
            }

            if(data.manager.toString() !== req.user.id){
                const error = new Error('Accion no valida')
                res.status(404).json({error : error.message})
            }
            
            res.json(data)
            
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request , res: Response) => {
        
        const {id} = req.params
        try {
            
            const project = await Project.findByIdAndUpdate(id , req.body)
            if(!project){
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error : error.message})
            }

             if(project.manager.toString() !== req.user.id){
                const error = new Error('Solo el manager puede actualizar un proyecto')
                res.status(404).json({error : error.message})
            }
            
            await project.save()
            res.send('Proyecto Actualizado')
            
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request , res: Response) => {
        
        const {id} = req.params
        try {
            const data = await Project.findById(id)
            if(!data){
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error : error.message})
            }

            if(data.manager.toString() !== req.user.id){
                const error = new Error('Solo el manager puede eliminar un proyecto')
                res.status(404).json({error : error.message})
            }
            
            await data.deleteOne()
            res.json('Proyecto eliminado')
            
        } catch (error) {
            console.log(error)
        }
    }


    

}