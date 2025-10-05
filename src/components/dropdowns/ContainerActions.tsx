import { useState } from "react";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { ToastContainer, toast } from 'react-toastify';
import LoadingOverlay from "../LoadingOverlay";
import { useToken } from "../../hooks/useToken";

type PropsType = {
  containerId: string,
  vpsId: string,
  changeContainerState: (status: string) => void,
  removeContainer: () => void
}


export default function ContainerActions({ containerId, vpsId, changeContainerState, removeContainer }: PropsType) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = useToken();
  const stopSuccess = () => toast.success("The container was stopped");
  const stopError = () => toast.error("An error occurred");

  const startSuccess = () => toast.success("The container has been launched");

  const deleteSuccess = () => toast.success("The container has been removed");

  const containerStop = async () => {
    setIsOpen(false);
    setIsLoading(true);
    await fetch(import.meta.env.VITE_API_URL + "/container/stop", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        vpsId: parseInt(vpsId),
        containerId: containerId
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
      //     return response.json(); // lub response.text(), zależnie od API
    })
      .then(() => {
        setIsLoading(false);
        changeContainerState("stopped")
        stopSuccess()
      })
      .catch(() => {
        setIsLoading(false);
        stopError();
      })
  }

  const containerStart = async () => {
      setIsOpen(false);
    setIsLoading(true);
    await fetch(import.meta.env.VITE_API_URL + "/container/start", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        vpsId: parseInt(vpsId),
        containerId: containerId
      })
    }).then(response => {
      if (!response.ok) {
        setIsLoading(false);
      }
      //     return response.json(); // lub response.text(), zależnie od API
    })
      .then(() => {
        setIsLoading(false);
        changeContainerState("running");
        startSuccess();
      })
      .catch(() => {
        setIsLoading(false);
      })
  }

  const containerDelete = async () => {
      setIsOpen(false);
      setIsLoading(true);
    await fetch(import.meta.env.VITE_API_URL + `/container/delete/${vpsId}/${containerId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
      //     return response.json(); // lub response.text(), zależnie od API
    })
      .then(() => {
        setIsLoading(false);
        removeContainer();
        deleteSuccess();
      })
      .catch(error => {
        setIsLoading(false);
        stopError();
        console.error("Błąd podczas wysyłania zapytania:", error);
      })
  }

  return (
    <div className="inline-block">
      <ToastContainer
        position="top-right"
        style={{
          top: "100px"
        }}
      />
      <LoadingOverlay
        isLoading={isLoading}
      />
      <button className="dropdown-toggle absolute" onClick={() => setIsOpen(true)}>
        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-40 p-2"
      >
        <DropdownItem
          onItemClick={containerStop}
          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Stop
        </DropdownItem>
        <DropdownItem
          onItemClick={containerStart}
          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Start
        </DropdownItem>
        <DropdownItem
          onItemClick={containerDelete}
          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Delete
        </DropdownItem>
      </Dropdown>
    </div>
  );
}