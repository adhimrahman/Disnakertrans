import { HiOutlineArrowSmallUp, HiOutlineArrowSmallDown } from "react-icons/hi2";

interface SortColumnProps<T extends string> {
  field: T;
  label: string;
  currentField: T;
  currentOrder: "asc" | "desc";
  onSort: (field: T) => void;
}

export const SortColumn = <T extends string>({
  field,
  label,
  currentField,
  currentOrder,
  onSort,
}: SortColumnProps<T>) => {
  const isActive = currentField === field;
  const upActive = isActive && currentOrder === "asc";
  const downActive = isActive && currentOrder === "desc";
  
  return (
    <button
      onClick={() => onSort(field)}
      className="flex flex-row items-center gap-1 font-semibold text-black hover:text-blue-500"
    >
      {label}
      <div className="flex flex-row leading-none text-lg ml-1">
        <HiOutlineArrowSmallDown className={upActive ? "text-blue-600 font-bold" : "text-gray-400"} />
        <HiOutlineArrowSmallUp className={downActive ? "text-blue-600 font-bold" : "text-gray-400"} />
      </div>
    </button>
  );
};