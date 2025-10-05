import { useEffect, useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Alert from "../ui/alert/Alert";
import { useForm, Controller } from 'react-hook-form';
import { TableVPS, VPSDto } from "../../types/vps";

type PropsType = {
  isOpen: boolean,
  closeModal: () => void,
  addVpsToState: (vps:TableVPS) => void,
  editForm?: boolean,
  id: number
}

type Alert = {
  show: boolean,
  variant: string,
  title: string,
  description: string
}

export default function AddVPSModal({ isOpen, closeModal, editForm = false, id = 0, addVpsToState }: PropsType) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<VPSDto>();

  // Pobranie tokena np. z localStorage
  const token = localStorage.getItem('token');

  const onSubmit = (data: VPSDto, checking: boolean) => {
    if (!checking) {
      addVPS(data)
    } else {
      checkVPSConnection(data)
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [checking, setChecking] = useState(false);
  const [alert, setAlert] = useState<Alert>({
    show: false,
    variant: "",
    title: "",
    description: ""
  });

  useEffect(() => {
    if (id > 0) {
      const fetchVPS = async () => {
        try {
          const res = await fetch(import.meta.env.VITE_API_URL + "/vps/" + id, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // <-- tu wysyłamy token
            }
          });
          const data = await res.json();
          console.log(data);
          reset({
            friendlyName: data.friendlyName,
            userName: data.userName,
            ip: data.ip,
            port: data.port,
            password: ""
          });
        } catch (error) {
          console.error('Błąd przy pobieraniu danych:', error);
        } finally {

          // setLoading(false);
        }
      }
      fetchVPS();
    }
  }, [id, reset]);

  const checkVPSConnection = async (data: VPSDto) => {
    setChecking(true);
    await fetch(import.meta.env.VITE_API_URL + "/vps/check-connection", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // <-- tu wysyłamy token
      },
      body: JSON.stringify({
        ...data,
        port: data.port,
        host: data.ip
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
      return response.json();
    })
      .then(data => {
        if (data) {
          setAlert({
            show: true,
            ...data
          })
        } else {
          setAlert({
            show: true,
            ...data
          })
        }
        setChecking(false)
      })
      .catch(() => {
        setAlert({
          variant: "error",
          description: "Server connection error",
          title: "Error",
          show: true
        });
        setChecking(false)
      })
  }

  {/* UPDATE VPS */ }
  const updateVPS = async (data: VPSDto) => {
    setChecking(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/vps/" + id, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <-- tu wysyłamy token
        },
        body: JSON.stringify({ ...data })
      });

      if (!response.ok) {
        setAlert({
          variant: "error",
          description: "Server connection error",
          title: "Error",
          show: true
        });
      }

      const result = await response.json();

      if (response.status === 200) {
        updateVPS(result);
        setChecking(false);
        closeModal();
      } else {
        setChecking(false);
        closeModal();
      }
    } catch (error) {
      setAlert({
        variant: "error",
        description: "Server connection error",
        title: "Error",
        show: true
      });
      setChecking(false)
    }
  };

  {/* CREATE VPS */ }
  const addVPS = async (data: VPSDto) => {
    setChecking(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/vps", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <-- tu wysyłamy token
        },
        body: JSON.stringify({ ...data })
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const result = await response.json();

      if (response.ok) {
        addVpsToState(result);
        setChecking(false);
        closeModal();
      } else {
        setChecking(false);
        closeModal();
      }
    } catch (error) {
      setAlert({
        variant: "error",
        description: "Server connection error",
        title: "Error",
        show: true
      });
      setChecking(false)
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {editForm ? "Edit VPS" : "Add VPS"}
          </h5>
          {/*<p className="text-sm text-gray-500 dark:text-gray-400">
                        
                      </p> */}
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
        </div>
        <div className="mt-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit((data) => onSubmit(data, checking))}>
              <Controller
                name="friendlyName"
                control={control}
                rules={{
                  required: 'Field is required'
                }}
                render={({ field }) => (
                  <div>
                    <Label htmlFor="friendlyName">Friendly Name</Label>
                    <Input
                      {...field}
                      disabled={checking}
                      type="text" id="friendlyName"
                      error={!!errors.friendlyName}
                      hint={errors.friendlyName?.message as string | undefined}

                    />
                  </div>
                )}
              />
              <Controller
                name="ip"
                control={control}
                rules={{
                  required: 'Field is required',
                  pattern: {
                    value: /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){2}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
                    message: 'Incorrect IP address',
                  },
                }}
                render={({ field }) => (
                  <div>
                    <Label htmlFor="ip">IP</Label>
                    <Input
                      {...field}
                      disabled={checking}
                      type="text" id="ip"
                      error={!!errors.ip}
                      hint={errors.ip?.message as string | undefined}
                    />
                  </div>
                )}
              />
              <Controller
                name="port"
                control={control}
                rules={{
                  required: 'Field is required',
                  validate: value => {
                    const portNum = Number(value);
                    if (isNaN(portNum)) {
                      return 'Port must be a number';
                    }
                    if (portNum < 1 || portNum > 65535) {
                      return 'The port must be in the range 1-65535';
                    }
                    return true;
                  }
                }}
                render={({ field, fieldState }) => (
                  <div>
                    <Label htmlFor="port">PORT</Label>
                    <Input
                      {...field}
                      disabled={checking}
                      type="number" id="port"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  </div>
                )}
              />
              <Controller
                name="userName"
                control={control}
                rules={{
                  required: 'Field is required'
                }}
                render={({ field }) => (
                  <div>
                    <Label htmlFor="userName">Username</Label>
                    <Input
                      {...field}
                      disabled={checking}
                      type="text" id="userName"
                      error={!!errors.userName}
                      hint={errors.userName?.message as string | undefined}
                    />
                  </div>
                )}
              />
              <Controller
                name="password"
                control={control}
                rules={{
                  required: 'Field is required'
                }}
                render={({ field }) => (
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        {...field}
                        disabled={checking}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        error={!!errors.password}
                        hint={errors.password?.message as string | undefined}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              />
            </form>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
          <Button
            disabled={checking}
            onClick={() => closeModal()}
            size="sm">
            Close
          </Button>
          <Button
            disabled={checking}
            onClick={handleSubmit((data) => onSubmit(data, true))}
            size="sm" variant="warning">
            Check
          </Button>
          <Button
            disabled={checking}
            onClick={handleSubmit((data) => onSubmit(data, false))}
            size="sm" variant="success">
            {editForm ? "Update VPS" : "Add VPS"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}