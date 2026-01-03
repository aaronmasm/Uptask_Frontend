import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { safeNavigation } from "@/utils/navigation";
import AddMemberForm from "@/components/team/AddMemberForm";

export default function AddMemberModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const addMember = queryParams.get("addMember");

  // Estado local sincronizado con URL para control inmediato del modal
  const [isOpen, setIsOpen] = useState(!!addMember);

  // Sincronizar estado local cuando cambia la URL
  useEffect(() => {
    setIsOpen(!!addMember);
  }, [addMember]);

  // Función para cerrar modal limpiamente
  const handleClose = () => {
    const cleanSearch = safeNavigation.clearQueryParam("addMember");
    navigate(cleanSearch, { replace: true });
    setIsOpen(false);
  };

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
                  <DialogTitle as="h3" className="font-black text-4xl  my-5">
                    Agregar Integrante al equipo
                  </DialogTitle>
                  <p className="text-xl font-bold">
                    Busca el nuevo integrante por email {""}
                    <span className="text-fuchsia-600">
                      para agregarlo al proyecto
                    </span>
                  </p>

                  <AddMemberForm />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
