import React, { useEffect, useState } from "react";
import Navbar from "pages/Navbar";
import { API_NEW_URL, X_API_Key } from "../config";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [paymentPaginationNumber, setPaymentPaginationNumber] = useState(0);
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const [SearchedData, setSearchedData] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [searchType, setSearchType] = useState("mode");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      const apiUrl = `${API_NEW_URL}invoice/list`;
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
          setInvoice(data.invoice);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchInvoices();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      let apiUrl = `${API_NEW_URL}payment/list?page=${paymentCurrentPage}&limit=${itemsPerPage}`;
      if (searchQuery.trim()) {
        apiUrl += `&${searchType}=${searchQuery}`;
      }

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
          setPayments(data.payments);
          setPaymentPaginationNumber(data.totalPages);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPayments();
  }, [paymentCurrentPage, searchType, searchQuery, itemsPerPage]); // Include itemsPerPage in dependency

  const FindInvoiceNumber = (id) => {
    const foundItem = invoice.find((item) => item._id === id);
    return foundItem ? foundItem : "";
  };

  const FindCustomerName = (id) => {
    const foundItem = SearchedData.find((item) => item._id === id);
    return foundItem ? foundItem : "SKU not found";
  };

  // Calculate the range of pages to display for pagination
  const calculatePageRange = (currentPage, paginationNumber) => {
    const pageRange = 5; // Number of page buttons to show around the current page
    const halfRange = Math.floor(pageRange / 2);
    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(startPage + pageRange - 1, paginationNumber);

    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(endPage - pageRange + 1, 1);
    }

    return { startPage, endPage };
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= paymentPaginationNumber) {
      setPaymentCurrentPage(newPage);
    }
  };

  const { startPage, endPage } = calculatePageRange(
    paymentCurrentPage,
    paymentPaginationNumber
  );

  // Filter payments based on searchType and searchQuery
  const filteredPayments = payments.filter((payment) => {
    if (!searchQuery) return true; // No search query, return all payments
    switch (searchType) {
      case "mode":
        return payment.mode.toLowerCase().includes(searchQuery.toLowerCase());
      case "customer":
        const customerName = FindCustomerName(payment.customerId)?.companyName;
        return customerName?.toLowerCase().includes(searchQuery.toLowerCase());
      case "invoiceNumber":
        const invoiceNumber = FindInvoiceNumber(
          payment.invoiceId
        )?.invoiceNumber;
        return invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      default:
        return true;
    }
  });

  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      setItemsPerPage(Number(e.target.value));
    }
  };

  return (
    <div className="mx-auto p-5">
      <Navbar
        logoText={"Medhouse Pharma - Inventory Management System"}
        brandText={"Payment List"}
      />
      <div className="mt-5 h-full rounded-[20px] bg-white p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
          <div className="rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
            <div className="flex justify-between items-center">
              {/* Left side - Search and Mode */}
              <div className="flex items-center">
                Payments
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="ml-4 w-max rounded-md p-2 px-3 text-base text-gray-800 outline-none"
                >
                  <option value="mode">Mode</option>
                  <option value="customer">Customer</option>
                  <option value="invoiceNumber">Invoice Number</option>
                </select>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="ml-2 w-60 rounded-md p-2 pl-3 text-base text-gray-800 outline-none placeholder:text-gray-600"
                  placeholder={`Search ${searchType}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Right side - Items per page and pagination */}
              <div className="flex items-center space-x-4">
                <label htmlFor="itemsPerPage" className="mr-2 text-base text-white">
                  Items per page:
                </label>
                <input
                  type="number"
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  onKeyDown={handleEnterKey} // Trigger action when Enter is pressed
                  min="1"
                  className="rounded-md p-1 border text-gray-800"
                />
                <div className="mt-1 text-base text-white">
                  <span>Total entries: {payments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Data Table */}
          {payments.length ? (
            <>
              <table className="w-full table-auto overflow-hidden">
                <thead>
                  <tr>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Transaction Date
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Amount
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Mode
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Customer Name
                    </th>
                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                      Invoice Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        {payment.transactionDate
                          ? new Date(payment.transactionDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        {payment.amount}
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        {payment.mode}
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        {FindCustomerName(payment.customerId).companyName}
                      </td>
                      <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                        {FindInvoiceNumber(payment.invoiceId).invoiceNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div>No payments found.</div>
          )}
          
          {/* Pagination Container */}
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              onClick={() => handlePageChange(paymentCurrentPage - 1)}
              className="p-2 rounded-md bg-gray-200 text-gray-800"
              disabled={paymentCurrentPage === 1}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            {/* Display only a limited range of page numbers */}
            {[...Array(paymentPaginationNumber)].map((_, index) => {
              const page = index + 1;
              if (page >= startPage && page <= endPage) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-md ${
                      page === paymentCurrentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
              return null; // Don't display pages outside of the range
            })}
            <button
              onClick={() => handlePageChange(paymentCurrentPage + 1)}
              className="p-2 rounded-md bg-gray-200 text-gray-800"
              disabled={paymentCurrentPage === paymentPaginationNumber}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentList;
