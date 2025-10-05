import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useToken } from "../../hooks/useToken";
import { _Alert } from "../../types/alert";
import Alert from "../ui/alert/Alert";


export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [alert, setAlert] = useState<_Alert>({
    show: false,
    variant: "",
    title: "",
    description: ""
  });
  const token = useToken();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormData>();

  interface FormData {
    currentPassword: string,
    password: string,
    repeatPassword: string
  }

  const changePassword = async (data: FormData) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/auth/change-password", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.password
        })
      });

      if (!response.ok) {
        const result = await response.json();
        console.log(result)
        setAlert({
          show: true,
          variant: result.variant,
          title: result.title,
          description: result.description
        })
      }

      const result = await response.json();

      if (response.status === 200) {
        setAlert({
          show: true,
          variant: result.variant,
          title: result.title,
          description: result.description
        })
      } else {

      }
    } catch (error) {
      console.log()
    }
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Change password
          </h4>
          <form onSubmit={handleSubmit((data) => changePassword(data))}>
            <div className="space-y-4">
              {alert.show &&
                <Alert
                  onClose={() => setAlert({
                    variant: "",
                    title: "",
                    description: "",
                    show: false
                  })}
                  variant={alert.variant as "success" | "error"}
                  title={alert.title}
                  message={alert.description}
                  showLink={false}
                />
              }
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* <!-- Current Password --> */}
                <Controller
                  name="currentPassword"
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
                          placeholder="Enter your old password"
                          type={showCurrentPassword ? "text" : "password"}
                          id="currentPassword"
                          error={!!errors.currentPassword}
                          hint={errors.currentPassword?.message as string | undefined}
                        />
                        <span
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                {/* Repeat Password */}
                <div className="space-y-4">
                  <Controller
                    name="repeatPassword"
                    control={control}
                    rules={{
                      required: "Field is required",
                      validate: (value) =>
                        value === getValues("password") || "Passwords must match!",
                    }}
                    render={({ field }) => (
                      <div>
                        <Label>
                          Repeat Password<span className="text-error-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Repeat password"
                            type={showPassword ? "text" : "password"}
                            id="repeatPassword"
                            error={!!errors.repeatPassword}
                            hint={errors.repeatPassword?.message}
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
                  {/* <!-- Button --> */}
                  <div>
                    <button
                      type="submit" className="flex items-center justify-center px-4 w-full py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
