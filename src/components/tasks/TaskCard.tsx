import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDraggable } from "@dnd-kit/core";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { deleteTaskById } from "@/api/task-api";
import type { TaskProject } from "@/types/index";

const statusStyles: { [key: string]: string } = {
  pending: "bg-slate-500 border-slate-500 text-slate-500 hover:bg-slate-600",
  onHold: "bg-red-500 border-red-500 text-red-500 hover:bg-red-600",
  inProgress: "bg-blue-500 border-blue-500 text-blue-500 hover:bg-blue-600",
  underReview:
    "bg-amber-500 border-amber-500 text-amber-500 hover:bg-amber-600",
  completed:
    "bg-emerald-500 border-emerald-500 text-emerald-500 hover:bg-emerald-600",
};

type TaskCardProps = {
  task: TaskProject;
  canEdit: boolean;
};

export default function TaskCard({ task, canEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
    });
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteTaskById,
    onError: (error) => toast.error(error.message),
    onSuccess: async (data) => {
      toast.success(data);
      await queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const dragHandleColor =
    statusStyles[task.status]?.split(" ")[0] || "bg-gray-300";
  const cardBorderColor =
    statusStyles[task.status]?.split(" ")[1] || "border-slate-300";
  const titleColor =
    statusStyles[task.status]?.split(" ")[2] || "text-slate-600";
  const hoverColor =
    statusStyles[task.status]?.split(" ")[3] || "hover:bg-slate-100";

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`relative p-5 bg-white border ${cardBorderColor} flex justify-between 
      items-start gap-3 cursor-default ${
        isDragging ? "z-50 shadow-xl scale-105" : ""
      }`}
    >
      {/* Botón de arrastre en la parte superior */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-md px-2 py-1 
        cursor-grab text-sm text-white shadow-md ${dragHandleColor}`}
        title="Arrastrar tarea"
        {...listeners}
        {...attributes}
      >
        ≡
      </div>

      {/* Contenido de la tarea */}
      <div className="min-w-0 flex flex-col gap-y-4 w-full">
        <button
          type="button"
          className={`text-xl font-bold text-left cursor-pointer ${titleColor}`}
          onClick={() => navigate(`?viewTask=${task._id}`)}
        >
          {task.taskName}
        </button>
        <p className="text-slate-500">{task.description}</p>
      </div>

      {/* Menú contextual */}
      <div className="flex shrink-0 gap-x-6">
        <Menu as="div" className="relative flex-none">
          <MenuButton
            className={`-m-2.5 block p-2.5 cursor-pointer transition-colors duration-200 ${
              task.status === "pending"
                ? "text-slate-500 hover:text-slate-900"
                : task.status === "onHold"
                  ? "text-red-500 hover:text-red-900"
                  : task.status === "inProgress"
                    ? "text-blue-500 hover:text-blue-900"
                    : task.status === "underReview"
                      ? "text-amber-500 hover:text-amber-900"
                      : task.status === "completed"
                        ? "text-emerald-500 hover:text-emerald-900"
                        : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right
            rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
            >
              <MenuItem>
                <button
                  type="button"
                  className={`block w-full text-left px-3 py-1 text-sm leading-6 
                  text-gray-900 cursor-pointer transition-colors duration-200 ${hoverColor}`}
                  onClick={() => navigate(`?viewTask=${task._id}`)}
                >
                  Ver Tarea
                </button>
              </MenuItem>

              {canEdit && (
                <>
                  <MenuItem>
                    <button
                      type="button"
                      className={`block w-full text-left px-3 py-1 text-sm leading-6 
                      text-gray-900 cursor-pointer transition-colors duration-200 ${hoverColor}`}
                      onClick={() => navigate(`?editTaskId=${task._id}`)}
                    >
                      Editar Tarea
                    </button>
                  </MenuItem>

                  <MenuItem>
                    <button
                      type="button"
                      className="block w-full text-left px-3 py-1 text-sm leading-6
                      text-red-500 hover:bg-red-100 cursor-pointer transition-colors duration-200"
                      onClick={() => mutate({ projectId, taskId: task._id })}
                    >
                      Eliminar Tarea
                    </button>
                  </MenuItem>
                </>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}
