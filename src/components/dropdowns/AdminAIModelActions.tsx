import { useState } from "react";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

type PropsType = {
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function AdminAIModelActions({ setModalIsOpen }: PropsType) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inline-block">
      <button className="dropdown-toggle absolute" onClick={() => setIsOpen(true)}>
        <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-40 p-2"
      >
        <DropdownItem
          onItemClick={() => setModalIsOpen(true)}
          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Edit
        </DropdownItem>
        <DropdownItem
         // onItemClick={() => navigate(`/vps/${id}`)}
          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Delete
        </DropdownItem>
      </Dropdown>
    </div>
  );
}