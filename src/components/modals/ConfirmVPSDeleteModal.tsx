import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

type PropsType = {
  isOpen: boolean,
  closeModal: () => void,
  editForm?: boolean,
  id: number,
  deleteVpsFromState: (id: number) => void
}

export default function ConfirmVPSDeleteModal({ isOpen, closeModal, id = 0, deleteVpsFromState }: PropsType) {
  // Pobranie tokena np. z localStorage
  const token = localStorage.getItem('token');

  const deleteVPS = async () => {
    await fetch(import.meta.env.VITE_API_URL + `/vps/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
    //  return response.json(); // lub response.text(), zależnie od API
    })
      .then(() => {
        deleteVpsFromState(id);
        closeModal();
      })
      .catch(error => {
        console.error("Błąd podczas wysyłania zapytania:", error);
      })
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
            Delete VPS
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you sure you want to delete your VPS data?
          </p>
        </div>
        <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
          <Button
            onClick={closeModal}
            size="sm">
            Close
          </Button>
          <Button
            onClick={() => deleteVPS()}
            size="sm" variant="warning">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}