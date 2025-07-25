import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { validateToken } from "@/api/auth-api";
import type { ConfirmToken } from "@/types/index";

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: Dispatch<SetStateAction<string>>;
  setIsValidToken: Dispatch<SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  const { mutate } = useMutation({
    mutationFn: validateToken,
    onError: (error) =>
      toast.error(error.message, {
        toastId: "NewPassToken-error",
      }),
    onSuccess: (data) => {
      toast.success(data, {
        toastId: "NewPassToken-success",
      });
      setIsValidToken(true);
    },
  });

  const handleComplete = (token: ConfirmToken["token"]) => mutate({ token });

  return (
    <>
      <form className="space-y-8 p-10 rounded-lg bg-white mt-10">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white text-center" />
          </PinInput>
        </div>
      </form>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
