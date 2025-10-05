import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import AddAIModelModal from "../modals/AddAIModelModal";
import AdminAIModelActions from "../dropdowns/AdminAIModelActions";
import { useToken } from "../../hooks/useToken";

export default function AdminAIModelsTable() {
  const [models, setModels] = useState<_AIModel[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalId, setModalId] = useState(0);
  const token = useToken();

  type _AIModel = {
    id: number,
    name: string,
    port: number,
    minRequiredRamMb: number
  }

  useEffect(() => {
    const fetchVPS = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/adminModels", {
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
    fetchVPS();
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <AddAIModelModal
          id={modalId}
          isOpen={modalIsOpen}
          closeModal={() => setModalIsOpen(false)}
        />
        <div className="max-w-full overflow-x-auto"></div>
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Min RAM
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Default PORT
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {models.map((e, index) => (
              <TableRow key={index}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {e.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {e.minRequiredRamMb}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {e.port}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex">
                  <AdminAIModelActions
                    setModalIsOpen={() => { setModalIsOpen(true) 
                      setModalId(e.id)
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}