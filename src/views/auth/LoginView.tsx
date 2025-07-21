import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticateUser } from "@/api/auth-api";
import ErrorMessage from "@/components/ErrorMessage";
import type { UserLoginForm } from "@/types/index";

export default function LoginView() {
  const initialValues: UserLoginForm = {
    email: "",
    password: "",
    rememberMe: false, // Añadimos esta propiedad
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLoginForm>({ defaultValues: initialValues });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    onError: (error) => toast.error(error.message, { toastId: "login-error" }),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["user"] }); // espera que termine el fetch con datos actualizados
      await navigate("/");
    },
  });

  const handleLogin = (formData: UserLoginForm) => mutate(formData);

  return (
    <>
      <h1 className="text-5xl font-black text-white">Iniciar Sesión</h1>
      <p className="text-2xl font-light text-white mt-5">
        Comienza a planear tus proyectos{" "}
        <span className="text-fuchsia-500 font-bold">
          iniciando sesión en este formulario
        </span>
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 mt-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Aquí agregamos el checkbox para Remember Me */}
        <div className="flex items-center gap-3">
          <input
            id="rememberMe"
            type="checkbox"
            {...register("rememberMe")}
            className="w-5 h-5 cursor-pointer"
          />
          <label
            htmlFor="rememberMe"
            className="text-lg font-normal select-none"
          >
            Recuérdame
          </label>
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to={"/auth/register"}
          className="text-center text-gray-300 font-normal"
        >
          ¿No tienes cuenta? Crear Una
        </Link>

        <Link
          to={"/auth/forgot-password"}
          className="text-center text-gray-300 font-normal"
        >
          ¿Olvidaste tu contraseña? Reestablecer
        </Link>
      </nav>
    </>
  );
}
