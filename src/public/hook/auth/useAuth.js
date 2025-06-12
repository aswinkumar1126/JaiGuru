import { useMutation } from "react-query";
import { registerUser, loginUser } from "../../service/AuthService";

export const useRegister = () =>
    useMutation({
        mutationFn: registerUser,
    });

export const useLogin = () =>
    useMutation({
        mutationFn: loginUser,
    });
