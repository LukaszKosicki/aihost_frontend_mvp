import { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { useForm, Controller } from 'react-hook-form';
import { useParams } from "react-router";
import { useToken } from "../../hooks/useToken";

type PropsType = {
  isOpen: boolean,
  closeModal: () => void,
  imageId: string
}

export default function RunImageModal({ isOpen, closeModal, imageId }: PropsType) {
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const token = useToken();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  interface FormData {
    port: string;
    containerName: string;
  }

  const run = async (data: FormData) => {
    console.log({
          imageId: imageId,
        containerName: data.containerName,
        port: parseInt(data.port),
        vpsId: parseInt(id ?? "0", 10)
    })
    setLoading(true);
    await fetch(import.meta.env.VITE_API_URL + `/image/runNewContainer`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        imageId: imageId,
        containerName: data.containerName,
        port: data.port,
        vpsId: parseInt(id ?? "0", 10)
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
    })
      .catch(error => {
        console.error("Błąd podczas wysyłania zapytania:", error);
      })
      .finally(() => setLoading(false))
  }

  const onSubmit = async (data: FormData) => {
    await run(data);
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
            Run container
          </h5>
          {/*<p className="text-sm text-gray-500 dark:text-gray-400">
                        
                      </p> */}
        </div>
        <div className="mt-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
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
                      disabled={loading}
                      type="number" id="port"
                      error={!!fieldState.error}
                      hint={fieldState.error?.message}
                    />
                  </div>
                )}
              />
              <Controller
                name="containerName"
                control={control}
                rules={{
                  required: 'Field is required'
                }}
                render={({ field }) => (
                  <div>
                    <Label htmlFor="containerName">Container Name</Label>
                    <Input
                      {...field}
                      disabled={loading}
                      type="text" id="userName"
                      error={!!errors.containerName}
                      hint={errors.containerName?.message as string | undefined}
                    />
                  </div>
                )}
              />
            </form>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
          <Button
            disabled={loading}
            onClick={() => closeModal()}
            size="sm">
            Close
          </Button>
          <Button
            disabled={loading}
            onClick={handleSubmit((data) => onSubmit(data))}
            size="sm" variant="success">
            Run
          </Button>
        </div>
      </div>
    </Modal>
  )
}