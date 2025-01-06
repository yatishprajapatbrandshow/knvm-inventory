import CheckTable from "./components/CheckTable";

import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "./variables/columnsData";
import tableDataDevelopment from "./variables/tableDataDevelopment.json";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataColumns from "./variables/tableDataColumns.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import DevelopmentTable from "./components/DevelopmentTable";
import ColumnsTable from "./components/ColumnsTable";
import ComplexTable from "./components/ComplexTable";

import { useEffect, useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { API_NEW_URL, X_API_Key } from "config";

const Tables = () => {
  const navigate = useNavigate();
  const [Invoice, setInvoice] = useState("")
  useEffect(() => {
    const getInvoice = async () => {
      const apiUrl = `${API_NEW_URL}invoice/list?name=&page=1&limit=2`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
  
        const data = await response.json();
        console.log("Dta", data);
        if(data.status === true){
          setInvoice(data.invoice)
        }
      } catch (error) {
        console.log(error);
      }
    };
    getInvoice();
  }, []);



  return (
    <div>
      {/* <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
          <button
            onClick={() => navigate("/stockregister")}
            className="flex cursor-pointer items-center justify-center gap-4 rounded-xl bg-white p-5
          shadow-sm dark:!bg-navy-800 dark:text-white dark:shadow-none"
          >
            Stock Register
            <span className="aspect-square cursor-pointer rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
              <MdArrowForward className="text-brand-500 dark:text-white" />
            </span>
          </button>
         
        </div> */}
      {/* {Invoice ? (
        <div className="rounded-[20px] bg-white shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none pb-10 p-4 h-full mt-5">
          <div class="text-xl font-bold border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 rounded-lg text-white dark:text-white">Invoice</div>          <table className="table-auto overflow-hidden w-full ">
            <thead>
              <tr>
                <th className="text-left w-auto font-dm font-bold text-sm text-gray-900 p-3">Customer ID</th>
                <th className="text-left w-auto font-dm font-bold text-sm text-gray-900 p-3">Payment Term</th>
                <th className="text-left w-auto font-dm font-bold text-sm text-gray-900 p-3">Tax</th>
                <th className="text-left w-auto font-dm font-bold text-sm text-gray-900 p-3">Total No Of Carton</th>
                <th className="text-left w-auto font-dm font-bold text-sm text-gray-900 p-3">Total Amount</th>
                <th className="text-left w-auto font-dm font-bold text-sm text-gray-900 p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {Invoice.map((item, index) => (
                <tr key={index} >
                  <td className="text-left w-auto font-dm p-3 font-normal border-b-[1px] border-l-gray-300 mb-2 text-sm text-gray-900">
                    {item.customer}
                  </td>
                  <td className="text-left w-auto font-dm p-3 font-normal border-b-[1px] border-l-gray-300 mb-2 text-sm text-gray-900">
                    {item.paymentTerm}
                  </td>
                  <td className="text-left w-auto font-dm p-3 font-normal border-b-[1px] border-l-gray-300 mb-2 text-sm text-gray-900">
                    {item.tax}
                  </td>
                  <td className="text-left w-auto font-dm p-3 font-normal border-b-[1px] border-l-gray-300 mb-2 text-sm text-gray-900">
                    {item.totalNoOfCarton}
                  </td>
                  <td className="text-left w-auto font-dm p-3 font-normal border-b-[1px] border-l-gray-300 mb-2 text-sm text-gray-900">
                    {item.totalAmount}
                  </td>
                  <td className="text-left w-auto font-dm p-3 font-normal border-b-[1px] border-l-gray-300 mb-2 text-sm text-gray-900">
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        ) : null} */}
    </div>
  );
};

export default Tables;
