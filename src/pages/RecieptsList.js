import React from 'react'
import Navbar from "pages/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_NEW_URL, X_API_Key } from "config";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
function RecieptsList() {
  const navigate = useNavigate();
  const [Recipt, setRecipt] = useState([]);
  const [TotalRecipt, setTotalRecipt] = useState(0);
  const [ReciptPaginationNumber, setReciptPaginationNumber] = useState(0);
  const [ReciptCurrentPage, setReciptCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const pageRange = 6; // Number of pagination buttons to show


  useEffect(() => {
    const fetchReceipts = async () => {
      const apiUrl = `${API_NEW_URL}receipt/list?page=${ReciptCurrentPage}&limit=${itemsPerPage}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
        const data = await response.json();
        console.log(data);
        if (data.status === true) {
          setRecipt(data.receipts);
          setTotalRecipt(data.total);
          setReciptPaginationNumber(Math.ceil(data.total / itemsPerPage));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchReceipts();
  }, [ReciptCurrentPage]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }


  // Calculate the range of pages to display for each type
  const calculatePageRange = (currentPage, paginationNumber) => {
    const halfRange = Math.floor(pageRange / 2);
    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(startPage + pageRange - 1, paginationNumber);

    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(endPage - pageRange + 1, 1);
    }

    return { startPage, endPage };
  };

  const handlePageChange = (type, newPage) => {
    switch (type) {
      case "receipt":
        if (newPage > 0 && newPage <= ReciptPaginationNumber) {
          setReciptCurrentPage(newPage);
        }
        break;
      default:
        break;
    }
  };
  const { startPage: reciptStartPage, endPage: reciptEndPage } =
    calculatePageRange(ReciptCurrentPage, ReciptPaginationNumber);
  return (
    <div>
      <div className="mx-auto p-5">
        <Navbar
          logoText={"Medhouse Pharma - Inventory Management System"}
          brandText={"Recipts List"}
        />
        <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
          {Recipt.length ? (
            <div className="mt-5 h-full rounded-[20px] bg-white p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
              <div className="rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
                Receipts
              </div>
              <table className="w-full table-auto overflow-hidden">
                <thead>
                  <tr>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Reference
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Contact
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Scheduled Date
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Source Document
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Company
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Recipt.map((item, index) => (
                    <tr key={index}>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        <button
                          onClick={() =>
                            navigate("/receipts", {
                              state: { reference: item },
                            })
                          }
                        >
                          {item.reference}
                        </button>
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        <button
                          onClick={() =>
                            navigate("/receipts", {
                              state: { reference: item },
                            })
                          }
                        >
                          {item.contact}
                        </button>
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        <button
                          onClick={() =>
                            navigate("/receipts", {
                              state: { reference: item },
                            })
                          }
                        >
                          {item.scheduledDate ? formatDate(item.scheduledDate) : null}

                        </button>
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        <button
                          onClick={() =>
                            navigate("/receipts", {
                              state: { reference: item },
                            })
                          }
                        >
                          {item.sourceDocument}
                        </button>
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        <button
                          onClick={() =>
                            navigate("/receipts", {
                              state: { reference: item },
                            })
                          }
                        >
                          {item.companyDetails?.companyName}
                        </button>
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        <button
                          onClick={() =>
                            navigate("/receipts", {
                              state: { reference: item },
                            })
                          }
                        >
                          {item.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-5 flex flex-wrap items-center justify-center">
                <button
                  onClick={() =>
                    handlePageChange("receipt", ReciptCurrentPage - 1)
                  }
                  disabled={ReciptCurrentPage === 1}
                  className="flex items-center justify-center p-2"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>

                {Array.from({ length: ReciptPaginationNumber }).map(
                  (_, index) => {
                    const page = index + 1;
                    return page >= reciptStartPage && page <= reciptEndPage ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange("receipt", page)}
                        className={`mx-1 rounded px-3 py-1 ${page === ReciptCurrentPage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {page}
                      </button>
                    ) : null;
                  }
                )}

                <button
                  onClick={() =>
                    handlePageChange("receipt", ReciptCurrentPage + 1)
                  }
                  disabled={ReciptCurrentPage === ReciptPaginationNumber}
                  className="flex items-center justify-center p-2"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="col-span-2 mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-navy-800">
              <h1 className="text-lg font-semibold">Receipts</h1>
              <div className="mt-2 text-sm text-gray-600">No data available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecieptsList
