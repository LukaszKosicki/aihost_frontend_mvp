import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import AddAIModelModal from "../../components/modals/AddAIModelModal";
import AdminAIModelsTable from "../../components/tables/AdminAIModelsTable";

const AIModelsList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
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
            List of AI Model
          </h3>
          <Button
            onClick={() => setIsOpen(true)}
            className="ml-auto"
            size="sm" variant="primary">
            Add AI Model
          </Button>
        </div>
        <div className="space-y-6">
          <AdminAIModelsTable />
        </div>
        <AddAIModelModal
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
      </div>
    </>
  )
}

export default AIModelsList;