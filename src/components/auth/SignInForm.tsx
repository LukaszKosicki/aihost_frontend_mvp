import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../AuthContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  interface FormData {
    email: string,
    password: string
  }


  const _login = async (data: FormData) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const result = await response.json();
      console.log("tokel: ", result)
      if (response.status === 200) {
        localStorage.setItem("token", result);
        console.log(result);
        // 🔹 ręczna aktualizacja stanu hooka
        login(result.token, result.email, result.role);
      } else {

      }
    } catch (error) {

    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Testing CI/CD!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit((data) => _login(data))}>
              <div className="space-y-6">
                {/* <!-- Email --> */}
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Field is required'
                  }}
                  render={({ field }) => (
                    <div>
                      <Label>
                        Email<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        {...field}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        error={!!errors.email}
                        hint={errors.email?.message as string | undefined}
                      />
                    </div>
                  )}
                />
                {/* <!-- Password --> */}
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Field is required'
                  }}
                  render={({ field }) => (
                    <div>
                      <Label>
                        Password<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          error={!!errors.password}
                          hint={errors.password?.message as string | undefined}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                />
                <div>
                  <Button
                    className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
