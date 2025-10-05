import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import ImageActions from "../dropdowns/ImageActions";
import Checkbox from "../form/input/Checkbox";
import { useToken } from "../../hooks/useToken";

type PropsType = {
  id: string | undefined
}


export default function DockerImagesTable({ id }: PropsType) {
  const [images, setImages] = useState<_image[]>([]);
  const [loading, setLoading] = useState(true)
  const token = useToken();

  type _image = {
    name: string,
    imageId: string,
    hasContainer: boolean,
    modelName: string
  }

  const removeImage = (id:string) => {
    setImages((prevItems) =>
      prevItems.filter((item) => item.imageId !== id)
    );
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await fetch(import.meta.env.VITE_API_URL + "/docker/getimages/" + id, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setLoading(false);
        setImages(data);
      } catch (error) {
        console.error('Błąd przy pobieraniu danych:', error);
      } finally {
        // setLoading(false);
      }
    }
    fetchImages();
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto px-5 pt-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            List of images
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
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Image Id
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
                Has Container
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
              </TableRow>
            )) :
              images.map((e, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {++index}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.imageId}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {e.modelName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {
                        <Checkbox
                          checked={e.hasContainer}
                          disabled
                          onChange={() => console.log("Checkbox is disabled")}
                        />
                    }
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex">
                    <ImageActions
                      imageId={e.imageId}
                      vpsId={id ?? "0"}
                      removeImage={() => removeImage(e.imageId)}
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