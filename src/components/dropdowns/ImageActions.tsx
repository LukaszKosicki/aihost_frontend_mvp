import { useState } from "react";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import LoadingOverlay from "../LoadingOverlay";
import { ToastContainer, toast } from 'react-toastify';
import RunImageModal from "../modals/RunImageModal";
import { useToken } from "../../hooks/useToken";

type PropsType = {
  imageId: string,
  vpsId: string,
  removeImage: () => void
}


export default function ImageActions({ imageId, vpsId, removeImage }: PropsType) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [runModal, setRunModal] = useState<boolean>(false);
  const token = useToken();
  const deleteSuccess = () => toast.success("The images was deleted");
  const _error = () => toast.error("An error occurred");

  const imageDelete = async () => {
    setLoading(true);
    await fetch(import.meta.env.VITE_API_URL + `/image/delete/${vpsId}/${imageId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        vpsId: parseInt(vpsId),
        imageId: imageId
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
      deleteSuccess();
      removeImage();
    })
      .catch(error => {
        _error();
        console.error("Błąd podczas wysyłania zapytania:", error);
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="inline-block">
      <button className="dropdown-toggle absolute" onClick={() => setIsOpen(true)}>
        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
      </button>
      <ToastContainer
        position="top-right"
        style={{
          top: "100px"
        }}
      />
      <RunImageModal
        isOpen={runModal}
        closeModal={() => setRunModal(false)}
        imageId={imageId}
      />
      <LoadingOverlay
        isLoading={loading}
      />
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-40 p-2"
      >
        <DropdownItem
          onItemClick={() => setRunModal(true)}
          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Run
        </DropdownItem>
        <DropdownItem
          onItemClick={imageDelete}
          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Delete
        </DropdownItem>
      </Dropdown>
    </div>
  );
}