
import { MdArrowForward} from "react-icons/md";

import {columnsDataComplex } from "./variables/columnsData";

import ComplexTable from "views/admin/warehouse/components/ComplexTable";
import Location from "views/admin/warehouse/components/Location";

import tableDataComplex from "./variables/tableDataComplex.json";



const Dashboard = () => {

  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <button
          className="bg-white flex gap-4 justify-center items-center p-5 rounded-xl shadow-sm cursor-pointer
          dark:!bg-navy-800 dark:text-white dark:shadow-none">
          Add New
          <span className="aspect-square rounded-full cursor-pointer bg-lightPrimary p-3 dark:bg-navy-700">
            <MdArrowForward className="text-brand-500 dark:text-white" />
          </span>
        </button>
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-3 gap-5">
        <Location />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5">
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
      </div>
    </div>
  );
};

export default Dashboard;
