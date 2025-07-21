import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/project-api";
import EditProjectForm from "@/components/projects/EditProjectForm";

export default function EditProjectView() {
  const params = useParams();
  const proyectId = params.projectId!;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editProject", proyectId],
    queryFn: () => getProjectById(proyectId),
    retry: false,
  });

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" />;
  if (data) return <EditProjectForm data={data} projectId={proyectId} />;
}
