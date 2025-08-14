import {Navigate,useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectByID } from "@/api/ProjectAPI"
import EditProjectForm from "@/components/projects/EditProjectForm"

export default function EditProjectView() {

    const params = useParams()
    const projectId = params.id!

    const { data, isLoading, isError } = useQuery({
        queryKey: ["editProject", projectId],
        queryFn: () => getProjectByID(projectId),
        retry: false
      });

    if(isLoading) return 'Cargando...'
    if(isError) <Navigate to='/404' />

    if (data) return <EditProjectForm data = {data} projectId = {projectId}/>
}
