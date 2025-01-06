import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { API_NEW_URL, X_API_Key } from "config";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Navbar from "pages/Navbar";
import { FiSearch } from 'react-icons/fi';

function InvoiceList() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("All");
    const [SearchedData, setSearchedData] = useState([]);
    const [isSearching, setIsSearching] = useState(false); // State to track if searching
    const [searchValue, setSearchValue] = useState(""); // State for search input

    // State for Invoices
    const [Invoice, setInvoice] = useState([]);
    const [InvoicePaginationNumber, setInvoicePaginationNumber] = useState(0);
    const [InvoiceCurrentPage, setInvoiceCurrentPage] = useState(1);

    // State for Search Results
    const [SearchResults, setSearchResults] = useState([]);
    const [SearchPaginationNumber, setSearchPaginationNumber] = useState(0);
    const [SearchCurrentPage, setSearchCurrentPage] = useState(1);

    const itemsPerPage = 10;
    const pageRange = 6; // Number of pagination buttons to show

    // Fetch data for Invoices
    useEffect(() => {
        if (isSearching) return; // Skip fetching general invoices if searching

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
    }, [InvoiceCurrentPage, status, isSearching]);

    // Handle Page Change
    const handlePageChange = (type, newPage) => {
        switch (type) {
            case "invoice":
                if (newPage > 0 && newPage <= InvoicePaginationNumber) {
                    setInvoiceCurrentPage(newPage);
                }
                break;
            case "search":
                if (newPage > 0 && newPage <= SearchPaginationNumber) {
                    setSearchCurrentPage(newPage);
                }
                break;
            default:
                break;
        }
    };

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

    // Fetch data for search results
    useEffect(() => {
        if (!isSearching) return; // Skip if not searching

        const fetchSearchResults = async () => {
            const apiUrl = `${API_NEW_URL}invoice/list?invoiceNumber=${searchValue}&page=${SearchCurrentPage}&limit=${itemsPerPage}`;
            try {
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": X_API_Key,
                    },
                });
                const data = await response.json();
                console.log("Search Invoice Data", data);
                if (data.status === true) {
                    setSearchResults(data.invoice);
                    setSearchPaginationNumber(Math.ceil(data.total / itemsPerPage));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSearchResults();
    }, [SearchCurrentPage, searchValue]);

    const calculatePageRange = (currentPage, paginationNumber) => {
        const halfRange = Math.floor(pageRange / 2);
        let startPage = Math.max(currentPage - halfRange, 1);
        let endPage = Math.min(startPage + pageRange - 1, paginationNumber);

        if (endPage - startPage + 1 < pageRange) {
            startPage = Math.max(endPage - pageRange + 1, 1);
        }

        return { startPage, endPage };
    };

    const { startPage: invoiceStartPage, endPage: invoiceEndPage } =
        calculatePageRange(InvoiceCurrentPage, InvoicePaginationNumber);

    const { startPage: searchStartPage, endPage: searchEndPage } =
        calculatePageRange(SearchCurrentPage, SearchPaginationNumber);

    const FindCustomerName = (id) => {
        const foundItem = SearchedData.find((item) => item._id === id);
        return foundItem ? foundItem : "SKU not found";
    };

    const handleSearch = (value) => {
        setSearchValue(value);

        if (value.length < 1) {
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        setSearchCurrentPage(1); // Reset search pagination to 1

        const fetchSearchResults = async () => {
            const apiUrl = `${API_NEW_URL}invoice/list?invoiceNumber=${value}&page=1&limit=${itemsPerPage}`;
            try {
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": X_API_Key,
                    },
                });
                const data = await response.json();
                console.log("Search Invoice Data", data);
                if (data.status === true) {
                    setSearchResults(data.invoice);
                    setSearchPaginationNumber(Math.ceil(data.total / itemsPerPage));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSearchResults();
    };

    // Helper function to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <div className="mx-auto p-5">
                <Navbar
                    logoText={"Medhouse Pharma - Inventory Management System"}
                    brandText={"Invoice List"}
                />
                <div>
                    <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
                        <div className="col-span-2 mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-navy-800">
                            <div className="flex items-center justify-between rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
                                <div className='flex gap-4 h-max justify-center items-center'>
                                    Invoices
                                    <div className="flex h-10 items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                                        <p className="pl-3 pr-2 text-xl">
                                            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                                        </p>
                                        <input
                                            onChange={(e) => handleSearch(e.target.value)}
                                            type="text"
                                            placeholder="Search invoice number"
                                            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                                        />
                                    </div>
                                </div>
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
                                        <option className="text-sm font-bold" value="Profarma">Proforma</option>
                                        <option className="text-sm font-bold" value="Void">Void</option>
                                    </select>
                                </div>
                            </div>
                            {(isSearching ? SearchResults.length > 0 : Invoice.length > 0) ? (
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
                                            {(isSearching ? SearchResults : Invoice).map((item, index) => (
                                                <tr key={index}>
                                                    <td
                                                        onClick={() =>
                                                            navigate("/invoice", { state: { reference: item } })
                                                        }
                                                        className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                                                    >
                                                        {item.invoiceNumber}
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
                                                        {item.status==='Profarma' ? "Proforma" : item.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {(isSearching ? SearchPaginationNumber : InvoicePaginationNumber) > 1 && (
                                        <div className="mt-5 flex flex-wrap items-center justify-center">
                                            <button
                                                onClick={() => handlePageChange(isSearching ? "search" : "invoice", (isSearching ? SearchCurrentPage : InvoiceCurrentPage) - 1)}
                                                disabled={(isSearching ? SearchCurrentPage : InvoiceCurrentPage) === 1}
                                                className="flex items-center justify-center p-2"
                                            >
                                                <ChevronLeftIcon className="h-6 w-6" />
                                            </button>

                                            {Array.from({ length: isSearching ? SearchPaginationNumber : InvoicePaginationNumber }).map((_, index) => {
                                                const page = index + 1;
                                                const startPage = isSearching ? searchStartPage : invoiceStartPage;
                                                const endPage = isSearching ? searchEndPage : invoiceEndPage;
                                                const currentPage = isSearching ? SearchCurrentPage : InvoiceCurrentPage;

                                                return page >= startPage && page <= endPage ? (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePageChange(isSearching ? "search" : "invoice", page)}
                                                        className={`mx-1 rounded px-3 py-1 ${page === currentPage
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-200 text-gray-700"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ) : null;
                                            })}

                                            <button
                                                onClick={() => handlePageChange(isSearching ? "search" : "invoice", (isSearching ? SearchCurrentPage : InvoiceCurrentPage) + 1)}
                                                disabled={(isSearching ? SearchCurrentPage : InvoiceCurrentPage) === (isSearching ? SearchPaginationNumber : InvoicePaginationNumber)}
                                                className="flex items-center justify-center p-2"
                                            >
                                                <ChevronRightIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <>
                                    <div className="mt-2 text-sm text-gray-600">No data available</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceList;
