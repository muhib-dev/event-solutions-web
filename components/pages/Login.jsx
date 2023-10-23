"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdLogin } from "react-icons/md";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import FormLabel from "../labels/FormLabel";
import TextField from "../inputs/TextField";
import ErrorLabel from "../labels/ErrorLabel";
import Spinner from "../Spinner";
import useAuth from "@/hooks/useAuth";
import { catchError } from "@/utils/catchError";

// validation schema
const loginSchema = object({
  userName: string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters long"),
  password: string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

const Login = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // on toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // protected page
  useEffect(() => {
    if (isAuthenticated) router.replace("/event/check-in");
  }, [isAuthenticated, router]);

  const onSubmitLogin = handleSubmit(async (data) => {
    try {
      setIsLoadingSubmit(true);
      await login(data.userName, data.password);

      router.replace("/event/check-in");
    } catch (error) {
      setLoginError(catchError(error));
      setIsLoadingSubmit(false);
    }
  });

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-10 mt-8 md:mt-0">Login</h2>

      <form onSubmit={onSubmitLogin} className="w-full px-4 lg:px-8 xl:px-20">
        <div className="mb-6">
          <FormLabel title="Username" />
          <TextField
            {...register("userName")}
            className="input-lg"
            placeholder="Enter your username"
          />
          <ErrorLabel message={errors.userName?.message} />
        </div>

        <div className="mb-3 relative">
          <FormLabel title="Password" />
          <TextField
            {...register("password")}
            type={isPasswordVisible ? "text" : "password"}
            className="input-lg"
            placeholder="Enter your password"
          />
          <ErrorLabel message={errors.password?.message} />

          {loginError && (
            <div className="alert alert-error mt-4">
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="button"
            className="absolute top-14 right-3 text-[#7B7B7B] text-3xl"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        <button
          disabled={isLoadingSubmit}
          className="btn btn-primary w-full bg-[#07004F] text-lg font-medium h-[55px] text-white mt-10"
        >
          {isLoadingSubmit ? <Spinner /> : <MdLogin className="text-2xl" />}
          {isLoadingSubmit ? "Logging in" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
