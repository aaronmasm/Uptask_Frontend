import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserToProject } from "@/api/team-api";
import type { TeamMember } from "@/types/index";

type SearchResultProps = {
  user: TeamMember;
  reset: () => void;
};

export default function SearchResult({ user, reset }: SearchResultProps) {
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) =>
      toast.error(error.message, {
        toastId: "AddUser-error",
      }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["projectTeam", projectId],
      });
      reset();
      toast.success(data, {
        toastId: "AddUser-success",
      });
    },
  });

  const handleAddUserToProject = () => {
    const data = {
      projectId,
      id: user._id,
    };

    mutate(data);
  };

  return (
    <>
      <p className="mt-10 text-center font-bold">Resultado</p>
      <div className="flex justify-between items-center">
        <p>{user.name}</p>
        <button
          className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
          onClick={handleAddUserToProject}
        >
          Agregar al proyecto
        </button>
      </div>
    </>
  );
}
