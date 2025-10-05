import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useParams } from 'react-router-dom';
import RamMetric from "../../components/metrics/RamMetric";
import DiscMetric from "../../components/metrics/DiscMetric";
import Button from "../../components/ui/button/Button";
import DeployAIModelModal from "../../components/modals/DeployAIModelModal";
import DockerContainersTable from "../../components/tables/DockerContainersTable";
import DockerImagesTable from "../../components/tables/DockerImagesTable";
import Skeleton from "react-loading-skeleton";
import { useToken } from "../../hooks/useToken";

const VPSDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [vps_info, setVps_info] = useState<_vps_info>();
  const [deployModalIsOpen, setDeployModalIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const token = useToken();

  type _vps_info = {
    ramUsagePercent: number,
    totalRamMb: number,
    usedRamMb: number,
    freeRamMb: number,
    diskUsagePercent: number,
    freeDiskGb: number,
    totalDiskGb: number,
    usedDiskGb: number,
    ipAddress: string,
    osVersion: string,
    friendlyName: string,
    dockerInstalled: boolean
  }

  // Icon for each variant
  const icons = {
    success: (
      <svg
        className="fill-current"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.70186 12.0001C3.70186 7.41711 7.41711 3.70186 12.0001 3.70186C16.5831 3.70186 20.2984 7.41711 20.2984 12.0001C20.2984 16.5831 16.5831 20.2984 12.0001 20.2984C7.41711 20.2984 3.70186 16.5831 3.70186 12.0001ZM12.0001 1.90186C6.423 1.90186 1.90186 6.423 1.90186 12.0001C1.90186 17.5772 6.423 22.0984 12.0001 22.0984C17.5772 22.0984 22.0984 17.5772 22.0984 12.0001C22.0984 6.423 17.5772 1.90186 12.0001 1.90186ZM15.6197 10.7395C15.9712 10.388 15.9712 9.81819 15.6197 9.46672C15.2683 9.11525 14.6984 9.11525 14.347 9.46672L11.1894 12.6243L9.6533 11.0883C9.30183 10.7368 8.73198 10.7368 8.38051 11.0883C8.02904 11.4397 8.02904 12.0096 8.38051 12.3611L10.553 14.5335C10.7217 14.7023 10.9507 14.7971 11.1894 14.7971C11.428 14.7971 11.657 14.7023 11.8257 14.5335L15.6197 10.7395Z"
        />
      </svg>
    ),
    error: (
      <svg
        className="fill-current"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.3499 12.0004C20.3499 16.612 16.6115 20.3504 11.9999 20.3504C7.38832 20.3504 3.6499 16.612 3.6499 12.0004C3.6499 7.38881 7.38833 3.65039 11.9999 3.65039C16.6115 3.65039 20.3499 7.38881 20.3499 12.0004ZM11.9999 22.1504C17.6056 22.1504 22.1499 17.6061 22.1499 12.0004C22.1499 6.3947 17.6056 1.85039 11.9999 1.85039C6.39421 1.85039 1.8499 6.3947 1.8499 12.0004C1.8499 17.6061 6.39421 22.1504 11.9999 22.1504ZM13.0008 16.4753C13.0008 15.923 12.5531 15.4753 12.0008 15.4753L11.9998 15.4753C11.4475 15.4753 10.9998 15.923 10.9998 16.4753C10.9998 17.0276 11.4475 17.4753 11.9998 17.4753L12.0008 17.4753C12.5531 17.4753 13.0008 17.0276 13.0008 16.4753ZM11.9998 6.62898C12.414 6.62898 12.7498 6.96476 12.7498 7.37898L12.7498 13.0555C12.7498 13.4697 12.414 13.8055 11.9998 13.8055C11.5856 13.8055 11.2498 13.4697 11.2498 13.0555L11.2498 7.37898C11.2498 6.96476 11.5856 6.62898 11.9998 6.62898Z"
          fill="#F04438"
        />
      </svg>
    )
  };
  const variantClasses = {
    success: {
      icon: "text-success-500",
    },
    error: {
      icon: "text-error-500",
    }
  };

  useEffect(() => {
    const fetchVPS = async () => {
      try {
        setLoading(true);
        const res = await fetch(import.meta.env.VITE_API_URL + `/vps/system-info/${id}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setVps_info(data);
        setIsConnecting(true);
      } catch (error) {
        setIsConnecting(false)
      } finally {
        setLoading(false);
        // setLoading(false);
      }
    }
    fetchVPS();
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="VPS Details" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            VPS Details
          </h3>
          <Button
            className="ml-auto"
            onClick={() => setDeployModalIsOpen(true)}
            size="sm" variant="primary">
            Deploy AI Model
          </Button>
        </div>
        <DeployAIModelModal
          id={id!}
          isOpen={deployModalIsOpen}
          closeModal={() => setDeployModalIsOpen(false)}
        />
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
            {/* <!-- Metric Item Start --> */}

            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                IP/Hostname
              </div>
              <h4 className="mt-2 font-bold text-gray-800 dark:text-white/90">
                {loading ? <Skeleton /> : vps_info?.ipAddress}
              </h4>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Operating system
              </div>
              <h4 className="mt-2 font-bold text-gray-800 dark:text-white/90">
                {loading ? <Skeleton /> : vps_info?.osVersion}
              </h4>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Connection status
              </div>
              {loading ? <Skeleton />
                :
                <div className={`flex items-center mt-2 ${variantClasses[isConnecting ? "success" : "error"].icon}`}>
                  {isConnecting ? icons["success"] : icons["error"]}
                  <h4 className="font-bold ml-2">
                    {isConnecting ? "Connected" : "Not connected"}
                  </h4>
                </div>
              }
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Docker installed
              </div>
              {loading ? <Skeleton /> :
                <div className={`flex items-center mt-2 ${variantClasses[vps_info?.dockerInstalled ? "success" : "error"].icon}`}>
                  {vps_info ? vps_info.dockerInstalled ? icons["success"] : icons["error"] : ""}
                  <h4 className="font-bold ml-2">
                    {vps_info ? vps_info.dockerInstalled ? "Installed" : "Not installed" : ""}
                  </h4>
                </div>
              }
            </div>

            {/* <!-- Metric Item End --> */}
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 lg:col-span-2">
              <RamMetric
                loading={loading}
                percent={vps_info ? vps_info.ramUsagePercent : 0}
                totalRam={vps_info ? vps_info.totalRamMb : 0}
                usedRam={vps_info ? vps_info.usedRamMb : 0}
                freeRam={vps_info ? vps_info.freeRamMb : 0}
              />
            </div>
            <div className="col-span-4 lg:col-span-2">
              <DiscMetric
                loading={loading}
                percent={vps_info ? vps_info.diskUsagePercent : 0}
                totalDisk={vps_info ? vps_info.totalDiskGb : 0}
                usedDisk={vps_info ? vps_info.usedDiskGb : 0}
                freeDisk={vps_info ? vps_info.freeDiskGb : 0}
              />
            </div>
            <div className="col-span-4">
              <DockerContainersTable
                id={id}
              />
            </div>
            <div className="col-span-4">
              <DockerImagesTable
                id={id}
              />
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default VPSDetails;