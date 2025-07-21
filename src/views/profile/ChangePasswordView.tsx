import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/api/profile-api";
import ErrorMessage from "@/components/ErrorMessage";
import type { UpdateCurrentUserPasswordForm } from "@/types/index";

export default function ChangePasswordView() {
  const initialValues: UpdateCurrentUserPasswordForm = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      toast.error(error.message, { toastId: "change-password-error" });
    },
    onSuccess: (data) => {
      toast.success(data, { toastId: "change-password-success" });
      reset();
    },
  });

  const password = watch("password");

  const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) =>
    mutate(formData);

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-black ">Cambiar Password</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Utiliza este formulario para cambiar tu password
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          autoComplete="off"
          noValidate
        >
          {/* Input trampa para engañar al navegador */}
          <input
            type="text"
            name="username"
            autoComplete="username"
            style={{ display: "none" }}
          />
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            style={{ display: "none" }}
          />

          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="old_pass_secret"
            >
              Password Actual
            </label>
            <input
              id="old_pass_secret"
              type="password"
              placeholder="Password Actual"
              autoComplete="new-password"
              className="w-full p-3 border border-gray-200"
              {...register("current_password", {
                required: "El password actual es obligatorio",
              })}
            />
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="new_pass">
              Nuevo Password
            </label>
            <input
              id="new_pass"
              type="password"
              placeholder="Nuevo Password"
              autoComplete="new-password"
              className="w-full p-3 border border-gray-200"
              {...register("password", {
                required: "El Nuevo Password es obligatorio",
                minLength: {
                  value: 8,
                  message: "El Password debe ser mínimo de 8 caracteres",
                },
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              htmlFor="confirm_pass"
              className="text-sm uppercase font-bold"
            >
              Repetir Password
            </label>
            <input
              id="confirm_pass"
              type="password"
              placeholder="Repetir Password"
              autoComplete="new-password"
              className="w-full p-3 border border-gray-200"
              {...register("password_confirmation", {
                required: "Este campo es obligatorio",
                validate: (value) =>
                  value === password || "Los Passwords no son iguales",
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value="Cambiar Password"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
