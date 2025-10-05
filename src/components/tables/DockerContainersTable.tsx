import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ContainerActions from "../dropdowns/ContainerActions";
import Badge from "../ui/badge/Badge";
import { useToken } from "../../hooks/useToken";

type PropsType = {
  id: string | undefined
}


export default function DockerContainersTable({ id } : PropsType) {
  const [containers, setContainers] = useState<_container[]>([]);
  const [loading, setLoading] = useState(true)
  const token = useToken();

  type _container = {
    name: string,
    status: string,
    modelName: string,
    id: string,
    port: string
  }

   const updateContainers = (id:string, status:string) => {
    setContainers((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: status } : item
      )
    );
  };

  const removeContainer = (id:string) => {
    setContainers((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  useEffect(() => {
    const fetchContainers = async () => {
      try {
        setLoading(true);
        const res = await fetch(import.meta.env.VITE_API_URL + "/docker/getcontainers/" + id, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setLoading(false);
        setContainers(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
      } finally {
        // setLoading(false);
      }
    }
    fetchContainers();
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto px-5 pt-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              List of containers
            </h3>
        </div>
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                No.
              </TableCell>
               <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Container Id
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Container Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Model Name
              </TableCell> 
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Port
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
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
              containers.map((e, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {++index}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.modelName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.port}
                  </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {
                    e.status === "running" &&   <Badge variant="solid" color="success">Running</Badge> ||
                    e.status === "stopped" &&   <Badge variant="solid" color="warning">Stopped</Badge> ||
                    e.status === "error" &&   <Badge variant="solid" color="error">Error</Badge>
                    }
                  </TableCell>
                   <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex">
                    <ContainerActions
                      vpsId={id ?? ""}
                      containerId={e.name}
                      changeContainerState={(status:string) => updateContainers(e.id, status)}
                      removeContainer={() => removeContainer(e.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </>
  )
}