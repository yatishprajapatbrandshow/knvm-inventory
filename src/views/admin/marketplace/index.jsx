import { useEffect, useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { API_NEW_URL, X_API_Key } from "config";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const Marketplace = () => {
  const navigate = useNavigate();

  // State for Receipts
  const [Recipt, setRecipt] = useState([]);
  const [TotalRecipt, setTotalRecipt] = useState(0);
  const [ReciptPaginationNumber, setReciptPaginationNumber] = useState(0);
  const [ReciptCurrentPage, setReciptCurrentPage] = useState(1);

  // State for Deliveries
  const [Deliveries, setDeliveries] = useState([]);
  const [DeliveriesPaginationNumber, setDeliveriesPaginationNumber] =
    useState(0);
  const [DeliveriesCurrentPage, setDeliveriesCurrentPage] = useState(1);

  // State for Invoices
  const [Invoice, setInvoice] = useState([]);
  const [InvoicePaginationNumber, setInvoicePaginationNumber] = useState(0);
  const [InvoiceCurrentPage, setInvoiceCurrentPage] = useState(1);

  // Filtering Code
  const [status, setStatus] = useState("All");

  // State for Searched Data
  const [SearchedData, setSearchedData] = useState([]);

  const itemsPerPage = 10;
  const pageRange = 6; // Number of pagination buttons to show

  // Fetch data for Receipts
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

  // Fetch data for Invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      const apiUrl = `${API_NEW_URL}invoice/list?page=${InvoiceCurrentPage}&limit=${itemsPerPage}&status=${status}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
        const data = await response.json();
        console.log("Invoice Data", data);
        if (data.status === true) {
          setInvoice(data.invoice);
          setInvoicePaginationNumber(Math.ceil(data.total / itemsPerPage));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchInvoices();
  }, [InvoiceCurrentPage, status]);

  // Fetch data for Customers
  useEffect(() => {
    const getCustomer = async () => {
      const apiUrl = `${API_NEW_URL}customer/list`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
        const data = await response.json();
        if (data.status === true) {
          setSearchedData(data.customers);
        } else {
          alert("Something went wrong please try again");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCustomer();
  }, []);
  
  const FindCustomerName = (id) => {
    const foundItem = SearchedData.find((item) => item._id === id);
    return foundItem ? foundItem : "SKU not found";
  };

  const handlePageChange = (type, newPage) => {
    switch (type) {
      case "receipt":
        if (newPage > 0 && newPage <= ReciptPaginationNumber) {
          setReciptCurrentPage(newPage);
        }
        break;
      case "delivery":
        if (newPage > 0 && newPage <= DeliveriesPaginationNumber) {
          setDeliveriesCurrentPage(newPage);
        }
        break;
      case "invoice":
        if (newPage > 0 && newPage <= InvoicePaginationNumber) {
          setInvoiceCurrentPage(newPage);
        }
        break;
      default:
        break;
    }
  };


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

  const { startPage: reciptStartPage, endPage: reciptEndPage } =
    calculatePageRange(ReciptCurrentPage, ReciptPaginationNumber);
  const { startPage: deliveriesStartPage, endPage: deliveriesEndPage } =
    calculatePageRange(DeliveriesCurrentPage, DeliveriesPaginationNumber);
  const { startPage: invoiceStartPage, endPage: invoiceEndPage } =
    calculatePageRange(InvoiceCurrentPage, InvoicePaginationNumber);

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2">
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
                  onClick={() => handlePageChange("delivery", DeliveriesCurrentPage - 1)}
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
                      onClick={() => handlePageChange("delivery", page)}
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
                  onClick={() => handlePageChange("delivery", DeliveriesCurrentPage + 1)}
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

      <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
        <div className="col-span-2 mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-navy-800">
          <div className="flex items-center justify-between rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
            Invoices
            <div className="flex items-center justify-center gap-2">
              <span className="flex justify-center">Status</span>
              <select
                name="Sort"
                id="sort"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-max h-10 rounded-lg border bg-white px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option className="text-sm font-bold" value="All">All</option>
                <option className="text-sm font-bold" value="Approved">Approved</option>
                <option className="text-sm font-bold" value="Profarma">Profarma</option>
                <option className="text-sm font-bold" value="Void">Void</option>
              </select>
            </div>
          </div>
          {Invoice.length ? (
            <div className="mt-5 h-full rounded-[20px] bg-white p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
              <table className="w-full table-auto overflow-hidden">
                <thead>
                  <tr>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Invoice Number
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Customer
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Payment term
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Date
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Total Amount
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Invoice.map((item, index) => (
                    <tr key={index}>
                      <td
                        onClick={() =>
                          navigate("/invoice", { state: { reference: item } })
                        }
                        className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                      >{item.invoiceNumber}
                      </td>
                      <td
                        onClick={() =>
                          navigate("/invoice", { state: { reference: item } })
                        }
                        className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                      >
                        {item.customer && SearchedData ? (
                          <>{FindCustomerName(item.customer).companyName}</>
                        ) : (
                          <></>
                        )}
                      </td>
                      <td
                        onClick={() =>
                          navigate("/invoice", { state: { reference: item } })
                        }
                        className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                      >
                        {item.paymentTerm}
                      </td>
                      <td
                        onClick={() =>
                          navigate("/invoice", { state: { reference: item } })
                        }
                        className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                      >
                        {item.invoiceDate ? formatDate(item.invoiceDate) : null}
                      </td>

                      <td
                        onClick={() =>
                          navigate("/invoice", { state: { reference: item } })
                        }
                        className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                      >
                        {item.totalAmount}
                      </td>
                      <td
                        onClick={() =>
                          navigate("/invoice", { state: { reference: item } })
                        }
                        className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                      >
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {InvoicePaginationNumber > 1 && (
                <div className="mt-5 flex flex-wrap items-center justify-center">
                  <button
                    onClick={() => handlePageChange("invoice", InvoiceCurrentPage - 1)}
                    disabled={InvoiceCurrentPage === 1}
                    className="flex items-center justify-center p-2"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>

                  {Array.from({ length: InvoicePaginationNumber }).map((_, index) => {
                    const page = index + 1;
                    return page >= invoiceStartPage && page <= invoiceEndPage ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange("invoice", page)}
                        className={`mx-1 rounded px-3 py-1 ${page === InvoiceCurrentPage
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {page}
                      </button>
                    ) : null;
                  })}

                  <button
                    onClick={() => handlePageChange("invoice", InvoiceCurrentPage + 1)}
                    disabled={InvoiceCurrentPage === InvoicePaginationNumber}
                    className="flex items-center justify-center p-2"
                  >
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                </div>
              )}

            </div>
          ) : (<>

            <div className="mt-2 text-sm text-gray-600">No data available</div></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
