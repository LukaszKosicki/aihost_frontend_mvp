import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import VPSListActions from "../dropdowns/VPSListActions";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import AddVPSModal from "../modals/AddVPSModal";
import ConfirmVPSDeleteModal from "../modals/ConfirmVPSDeleteModal";
import { TableVPS } from "../../types/vps";

type PropsType = {
  isOpenAddVpsModal: boolean,
  updateAddModalIsOpen: (value: boolean) => void
}

export default function VPSTable({ isOpenAddVpsModal, updateAddModalIsOpen }: PropsType) {
  const [vps, setVps] = useState<TableVPS[]>([]);
  const [loading, setLoading] = useState(true)
  const [vpsSelected, setVpsSelected] = useState<_vpsSelected>({
    showEditModal: false,
    selectedVps: 0,
    showDeleteModal: false
  });

  type _vpsSelected = {
    showEditModal: boolean,
    selectedVps: number,
    showDeleteModal: boolean
  }

  const deleteVpsFromState = (id: number) => {
    setVps(prevVps => prevVps.filter(v => v.id !== id));
  };

  const addVpsToState = (newVps: TableVPS) => {
    setVps(prev => [...prev, newVps]);
  };


  useEffect(() => {
    const fetchVPS = async () => {
      try {
        setLoading(true);

        // Pobranie tokena np. z localStorage
        const token = localStorage.getItem('token');

        const res = await fetch(import.meta.env.VITE_API_URL + "/vps", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <-- tu wysyłamy token
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data)
        setVps(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVPS();
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                IP
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                PORT
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
            {loading ? [...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Skeleton />
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Skeleton />
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Skeleton />
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Skeleton />
                </TableCell>
              </TableRow>
            )) :
              vps.map((e) => (
                <TableRow key={`vps-row-${e.id}`}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.friendlyName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.ip}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.port}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex">
                    <VPSListActions
                      id={e.id}
                      onEdit={() => setVpsSelected({
                        showDeleteModal: false,
                        showEditModal: true,
                        selectedVps: e.id
                      })
                      }
                      onDelete={() => setVpsSelected({
                        showDeleteModal: true,
                        showEditModal: false,
                        selectedVps: e.id
                      })}
                    />
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <ConfirmVPSDeleteModal
          deleteVpsFromState={deleteVpsFromState}
          id={vpsSelected.selectedVps}
          isOpen={vpsSelected.showDeleteModal}
          closeModal={() => setVpsSelected({
            showDeleteModal: false,
            showEditModal: false,
            selectedVps: 0
          })}
        />
        <AddVPSModal
          addVpsToState={addVpsToState}
          isOpen={vpsSelected.showEditModal || isOpenAddVpsModal}
          closeModal={() => {
            updateAddModalIsOpen(false);
            setVpsSelected({
              showDeleteModal: false,
              showEditModal: false,
              selectedVps: 0
            })
          }}
          editForm={!isOpenAddVpsModal}
          id={vpsSelected.selectedVps}
        />
      </div>
    </>
  )
}