import { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import { useToken } from "../../hooks/useToken";

type PropsType = {
  id?: number,
  isOpen: boolean,
  closeModal: () => void,
  selectedEvent?: boolean
}

export default function AddAIModelModal({ isOpen, closeModal, selectedEvent = false, id }: PropsType) {
  const [name, setName] = useState("");
  const [minRequiredRamMb, setMinRequiredRamMb] = useState("0");
  const [modelInternalName, setModelInternalName] = useState("");
  const [defaultPort, setDefaultPort] = useState("0");
  const [tags, setTags] = useState("");
  const [supportsGPU, setSupportsGPU] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const token = useToken();

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + `/adminmodels/${id}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setName(data.name);
        setMinRequiredRamMb(data.minRequiredRamMb);
        setModelInternalName(data.modelInternalName);
        setDefaultPort(data.defaultPort);
        setTags(data.tags);
        setSupportsGPU(data.supportsGPU);
        setIsActive(data.isActive);
      } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
      } finally {
        // setLoading(false);
      }
    }
    id && id > 0 && fetchModel();
  }, [id])

  const addAIModel = async () => (
    id ?
    await fetch(import.meta.env.VITE_API_URL + `/adminmodels/${id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        minRequiredRamMb: parseInt(minRequiredRamMb, 10),
        defaultPort: parseInt(defaultPort, 10),
        tags,
        modelInternalName,
        supportsGPU, isActive
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
   //   return response.json(); // lub response.text(), zależnie od API
    })
      .then(() => {
        closeModal();
      })
      .catch(error => {
        console.error("Błąd podczas wysyłania zapytania:", error);
      }) :
      await fetch(import.meta.env.VITE_API_URL + "/adminmodels", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        minRequiredRamMb: parseInt(minRequiredRamMb, 10),
        defaultPort: parseInt(defaultPort, 10),
        tags,
        modelInternalName,
        supportsGPU, isActive
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }
 //     return response.json(); // lub response.text(), zależnie od API
    })
      .then(() => {
        closeModal();
      })
      .catch(error => {
        console.error("Błąd podczas wysyłania zapytania:", error);
      })
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-6 lg:p-10"
    >
      <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
        <div>
          <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {selectedEvent ? "Edit VPS" : "Add VPS"}
          </h5>
          {/*<p className="text-sm text-gray-500 dark:text-gray-400">
                        
                      </p> */}
        </div>
        <div className="mt-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                type="text" id="name" />
            </div>
            <div>
              <Label htmlFor="ModelInternalName">Model Internal Name</Label>
              <Input
                value={modelInternalName}
                onChange={e => setModelInternalName(e.target.value)}
                type="text" id="ModelInternalName" />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                value={tags}
                onChange={e => setTags(e.target.value)}
                type="text" id="tags" />
            </div>
            <div>
              <Label htmlFor="minRequiredRamMb">Min RAM</Label>
              <Input
                onChange={e => setMinRequiredRamMb(e.target.value)}
                type="number" value={minRequiredRamMb} id="minRequiredRamMb" />
            </div>
            <div>
              <Label htmlFor="defaultPort">Default Port</Label>
              <Input
                onChange={e => setDefaultPort(e.target.value)}
                type="number" value={defaultPort} id="defaultPort" />
            </div>
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
            onClick={addAIModel}
            type="button"
            className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
          >
            {selectedEvent ? "Update AI Model" : "Add AI Model"}
          </button>
        </div>
      </div>
    </Modal>
  )
}