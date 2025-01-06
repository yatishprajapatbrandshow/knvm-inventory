  import React, { useState, useEffect } from "react";
  import Navbar from "pages/Navbar";
  import { useNavigate } from "react-router-dom";
  import { API_NEW_URL, X_API_Key } from "config";
  import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

  function DeliveryList() {
    const navigate = useNavigate();
    // State for Deliveries
    const [Deliveries, setDeliveries] = useState([]);
    const [DeliveriesPaginationNumber, setDeliveriesPaginationNumber] = useState(0);
    const [DeliveriesCurrentPage, setDeliveriesCurrentPage] = useState(1);

    const itemsPerPage = 10;
    const pageRange = 6; // Number of pagination buttons to show

    // Fetch data for Deliveries
    useEffect(() => {
      const fetchDeliveries = async () => {
        const apiUrl = `${API_NEW_URL}delivery/list?page=${DeliveriesCurrentPage}&limit=${itemsPerPage}`;
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
            setDeliveries(data.deliveries);
            setDeliveriesPaginationNumber(Math.ceil(data.total / itemsPerPage));
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchDeliveries();
    }, [DeliveriesCurrentPage]);

    function formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();

      return `${day}-${month}-${year}`;
    }

    // Calculate the range of pages to display
    const calculatePageRange = (currentPage, paginationNumber) => {
      const halfRange = Math.floor(pageRange / 2);
      let startPage = Math.max(currentPage - halfRange, 1);
      let endPage = Math.min(startPage + pageRange - 1, paginationNumber);

      if (endPage - startPage + 1 < pageRange) {
        startPage = Math.max(endPage - pageRange + 1, 1);
      }

      return { startPage, endPage };
    };

    // Handle page change
    const handlePageChange = (newPage) => {
      if (newPage > 0 && newPage <= DeliveriesPaginationNumber) {
        setDeliveriesCurrentPage(newPage);
      }
    };

    const { startPage: deliveriesStartPage, endPage: deliveriesEndPage } =
      calculatePageRange(DeliveriesCurrentPage, DeliveriesPaginationNumber);

    return (
      <div>
        <div className="mx-auto p-5">
          <Navbar
            logoText={"Medhouse Pharma - Inventory Management System"}
            brandText={"Deliveries List"}
          />
          <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
            {Deliveries.length ? (
              <div className="mt-5 h-full rounded-[20px] bg-white p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
                <div className="rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
                  Deliveries
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
                    {Deliveries.map((item, index) => (
                      <tr key={index}>
                        <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                          <button
                            onClick={() =>
                              navigate("/deliveries", {
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
                              navigate("/deliveries", {
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
                              navigate("/deliveries", {
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
                              navigate("/deliveries", {
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
                              navigate("/deliveries", {
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
                              navigate("/deliveries", {
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

                {DeliveriesPaginationNumber > 1 && (
                  <div className="mt-5 flex flex-wrap items-center justify-center">
                    <button
                      onClick={() => handlePageChange(DeliveriesCurrentPage - 1)}
                      disabled={DeliveriesCurrentPage === 1}
                      className="flex items-center justify-center p-2"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>

                    {Array.from({ length: DeliveriesPaginationNumber }).map((_, index) => {
                      const page = index + 1;
                      return page >= deliveriesStartPage && page <= deliveriesEndPage ? (
                        <button
                          key={index}
                          onClick={() => handlePageChange(page)}
                          className={`mx-1 rounded px-3 py-1 ${page === DeliveriesCurrentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                        >
                          {page}
                        </button>
                      ) : null;
                    })}

                    <button
                      onClick={() => handlePageChange(DeliveriesCurrentPage + 1)}
                      disabled={DeliveriesCurrentPage === DeliveriesPaginationNumber}
                      className="flex items-center justify-center p-2"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="col-span-2 mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-navy-800">
                <h1 className="text-lg font-semibold">Deliveries</h1>
                <div className="mt-2 text-sm text-gray-600">No data available</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  export default DeliveryList;
