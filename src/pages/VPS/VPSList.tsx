import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import VPSTable from "../../components/tables/VPSTable";
import Button from "../../components/ui/button/Button";

const VPSList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const updateIsOpen = (value:boolean) => {
    setIsOpen(value)
  }

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="VPS" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            List of your VPS
          </h3>
          <Button
            onClick={() => setIsOpen(true)}
            className="ml-auto"
            size="sm" variant="primary">
            Add VPS
          </Button>
        </div>
        <div className="space-y-6">
          <VPSTable 
            updateAddModalIsOpen={updateIsOpen}
            isOpenAddVpsModal={isOpen}
          />
        </div>
      </div>
    </>
  )
}

export default VPSList;