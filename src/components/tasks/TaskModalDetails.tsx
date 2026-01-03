import { Fragment, useEffect, useState, ChangeEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { getTaskById, updateStatus } from "@/api/task-api";
import { safeNavigation } from "@/utils/navigation";
import NotesPanel from "@/components/notes/NotesPanel";
import { formatDate } from "@/utils/utils";
import { statusTranslations } from "@/locales/es";
import type { TaskStatus } from "@/types/index";

export default function TaskModalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const projectId = params.projectId!;
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask");

  // Estado local sincronizado con URL
  const [isOpen, setIsOpen] = useState(!!taskId);

  // Sincronizar estado local cuando cambia la URL
  useEffect(() => {
    setIsOpen(!!taskId);
  }, [taskId]);

  // Función para cerrar modal limpiamente
  const handleClose = () => {
    const cleanSearch = safeNavigation.clearQueryParam("viewTask");
    navigate(cleanSearch, { replace: true });
    setIsOpen(false);
  };

  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => await getTaskById({ projectId, taskId: taskId! }),
    enabled: !!taskId,
    retry: false,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => toast.error(error.message),
    onSuccess: async (data) => {
      toast.success(data);
      await queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      await queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      handleClose();
    },
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;
    const data = { projectId, taskId: taskId!, status };
    mutate(data);
  };

  useEffect(() => {
    if (isError) {
      toast.error(error.message, { toastId: "error" });
      navigate(`/projects/${projectId}`, { replace: true });
    }
  }, [isError, error, navigate, projectId]);

  if (data)
    return (
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={handleClose}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                    <p className="text-sm text-slate-400">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <DialogTitle
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5"
                    >
                      {data.taskName}
                    </DialogTitle>
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción: {data.description}
                    </p>

                    {data.completedBy.length ? (
                      <>
                        <p className="font-bold text-2xl text-slate-600 my-5">
                          Historial de Cambios
                        </p>

                        <ul className="list-decimal">
                          {data.completedBy.map((activityLog) => {
                            let statusClass = "";

                            switch (activityLog.status) {
                              case "pending":
                                statusClass = "font-bold text-slate-500";
                                break;
                              case "onHold":
                                statusClass = "font-bold text-red-500";
                                break;
                              case "inProgress":
                                statusClass = "font-bold text-blue-500";
                                break;
                              case "underReview":
                                statusClass = "font-bold text-amber-500";
                                break;
                              case "completed":
                                statusClass = "font-bold text-emerald-500";
                                break;
                            }

                            return (
                              <li
                                key={activityLog.user._id}
                                className={statusClass}
                              >
                                <span className={statusClass}>
                                  {statusTranslations[activityLog.status]} por:
                                </span>{" "}
                                {activityLog.user.name}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    ) : null}

                    <div className="my-5 space-y-3">
                      <label className="font-bold">Estado Actual:</label>
                      <select
                        className="w-full p-3 bg-white border border-gray-300"
                        defaultValue={data.status}
                        onChange={handleChange}
                      >
                        {Object.entries(statusTranslations).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <NotesPanel notes={data.notes} />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
