import { isAxiosError } from "axios";
import api from "../lib/axios";
import { Project, Task, TaskFormData, taskSchema } from "../types";

type TaskAPI ={
    formData : TaskFormData
    projectId : Project['_id']
    taskId: Task['_id']
    status: Task['status']
}

export async function createTask({formData, projectId} : Pick<TaskAPI , 'formData' | 'projectId'>){
    try {
        let url = `projects/${projectId}/tasks`
        const {data} = await api.post(url, formData)
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTaskById({projectId , taskId} : Pick<TaskAPI , 'projectId' | 'taskId'>){
    try {
        let url = `projects/${projectId}/tasks/${taskId}`
        const {data} = await api(url)
        const response = taskSchema.safeParse(data)
        if(response.success){
           return response.data 
        }
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateTask({projectId, taskId, formData} : Pick<TaskAPI , 'taskId' | 'projectId' | 'formData'>){
    try {
        let url = `projects/${projectId}/tasks/${taskId}`
        const {data} = await api.put(url, formData)
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteTask({projectId, taskId} : Pick<TaskAPI , 'taskId' | 'projectId'>){
    try {
        let url = `projects/${projectId}/tasks/${taskId}`
        const {data} = await api.delete(url)
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateStatus({projectId, taskId, status} : Pick<TaskAPI , 'taskId' | 'projectId' | 'status'>){
    try {
        let url = `projects/${projectId}/tasks/${taskId}/status`
        const {data} = await api.put<string>(url, {status})
        
        return data
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}