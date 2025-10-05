import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import Select from "../form/Select";
import * as signalR from "@microsoft/signalr";
import BashTerminal from "../BashTerminal";
import { Controller, useForm } from "react-hook-form";
import { useToken } from "../../hooks/useToken";

type PropsType = {
  isOpen: boolean,
  closeModal: () => void,
  // selectedEvent?: boolean,
  id: string
}


type ModelOption = {
  value: string;
  label: string;
};

export default function DeployAIModelModal({ isOpen, closeModal, id }: PropsType) {
  const [checking, setChecking] = useState<boolean>(false);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [showBash, setShowBash] = useState<boolean>(false);
  const token = useToken();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  interface FormData {
    modelId: string;
    containerName: string;
    port: string;
    exposePort: string
  }

  useEffect(() => {
    const getAllModels = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/aimodel", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setModels(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
      } finally {
        // setLoading(false);
      }
    }
    getAllModels();
  }, [])


  const deployModel = async (data: FormData) => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_API_URL + "/hubs/log")
      .configureLogging(signalR.LogLevel.Information)
      .build();
    setChecking(true)
    setShowBash(true);
    connection.on("ReceiveLog", (message) => {
      console.log("Log " + message);
      setLogs(prevLogs => [...prevLogs, message]); // dodajemy do listy logów
    });

    // 3. Start połączenia
    await connection.start();
    console.log("✅ SignalR connected");

    // 4. Pobranie ConnectionId z huba
    const connectionId = await connection.invoke("GetConnectionId");
    console.log("🔗 ConnectionId:", connectionId);

    // 5. Wywołanie API deploya
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/modeldeploy/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          modelId: parseInt(data.modelId),
          vpsId: parseInt(id),
          exposePort: parseInt(data.exposePort),
          port: parseInt(data.port),
          containerName: data.containerName,
          connectionId // przekazujemy connectionId do backendu
        }),
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const result = await response.json();
      console.log("Odpowiedź z API:", result);
    } catch (error) {
      console.error("❌ Błąd podczas wysyłania zapytania:", error);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            Deploy AI Model
          </h5>
          {/*<p className="text-sm text-gray-500 dark:text-gray-400">
                        
                      </p> */}
        </div>
        {showBash ?
          <BashTerminal
            logs={logs}
          />
          :
          <div>
            <div className="mt-8">
              <div className="space-y-6">
                <form onSubmit={handleSubmit((data) => deployModel(data))}>
                  <Controller
                    name="modelId"
                    control={control}
                    rules={{
                      required: 'Field is required'
                    }}
                    render={({ field, fieldState }) => {
                      return (
                        <div>
                          <label>Select AI Model</label>
                          <Select
                            options={models}
                            placeholder="Selected AI model"
                            defaultValue={field.value} // <- bind value z RHF
                            onChange={field.onChange} // <- bind onChange z RHF
                          />
                          {fieldState.error && (
                            <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                          )}
                        </div>
                      );
                    }}
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
                    name="exposePort"
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
                        <Label htmlFor="port">Expose PORT</Label>
                        <Input
                          {...field}
                          disabled={checking}
                          type="number" id="exposePort"
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
                        <Label htmlFor="userName">Container Name</Label>
                        <Input
                          {...field}
                          disabled={checking}
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
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
              <button
                onClick={handleSubmit((data) => deployModel(data))}
                type="button"
                className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
              >
                Deploy AI Model
              </button>
            </div>
          </div>
        }
      </div>
    </Modal>
  )
}