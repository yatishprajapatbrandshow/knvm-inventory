import React, { useEffect, useState } from 'react';
import Navbar from "pages/Navbar";
import { API_NEW_URL, X_API_Key } from "../config";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [customerPaginationNumber, setCustomerPaginationNumber] = useState(0);
    const [customerCurrentPage, setCustomerCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10;
    const pageRange = 6; // Number of pagination buttons to show
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            const apiUrl = `${API_NEW_URL}customer/list?page=${customerCurrentPage}&limit=${itemsPerPage}&name=${searchQuery}`;
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
                    console.log(data);
                    
                    setCustomers(data.customers);
                    setCustomerPaginationNumber(Math.ceil(data.total / itemsPerPage));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchCustomers();
    }, [customerCurrentPage, searchQuery]);

    // Calculate the range of pages to display for pagination
    const calculatePageRange = (currentPage, paginationNumber) => {
        const halfRange = Math.floor(pageRange / 2);
        let startPage = Math.max(currentPage - halfRange, 1);
        let endPage = Math.min(startPage + pageRange - 1, paginationNumber);

        if (endPage - startPage + 1 < pageRange) {
            startPage = Math.max(endPage - pageRange + 1, 1);
        }

        return { startPage, endPage };
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= customerPaginationNumber) {
            setCustomerCurrentPage(newPage);
        }
    };

    const { startPage, endPage } = calculatePageRange(customerCurrentPage, customerPaginationNumber);


    const handleClickOnCustomer = (customer) => {
        navigate('/customer/payment-history', { state: { customer } });
    }

    return (
        <div className='mx-auto p-5'>
            <Navbar
                logoText={"Medhouse Pharma - Inventory Management System"}
                brandText={"Customer List"}
            />
            <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
                {customers.length ? (
                    <div className="mt-5 h-full rounded-[20px] bg-white p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
                        <div className="rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white flex gap-4 justify-start items-center">
                            Customers
                            <div className="flex h-10 items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
                                <p className="pl-3 pr-2 text-xl">
                                    <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
                                </p>
                                <input
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    type="text"
                                    placeholder="Search Customer. . . . ."
                                    className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                                />
                            </div>
                        </div>
                        <table className="w-full table-auto overflow-hidden">
                            <thead>
                                <tr>
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                                        Name
                                    </th>
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                                        Company
                                    </th>
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                                        Email
                                    </th>
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                                        Phone
                                    </th>
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                                        Address
                                    </th>
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {customers.map((customer) => (
                                    <tr key={customer._id} onClick={() => { handleClickOnCustomer(customer) }} >
                                        <td className="mb-4 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                                            {customer.name}
                                        </td>
                                        <td className="mb-4 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                                            {customer.companyName}
                                        </td>
                                        <td className="mb-4 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                                            {customer.email}
                                        </td>
                                        <td className="mb-4 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                                            {customer.phone}
                                        </td>
                                        <td className="mb-4 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                                            {`${customer.address?.street}, ${customer.address?.city}, ${customer.address?.state} - ${customer.address?.zip}`}
                                        </td>
                                        <td className="mb-4 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                                            {customer.status ? "Active" : "Inactive"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        <div className="mt-5 flex flex-wrap items-center justify-center">
                            <button
                                onClick={() => handlePageChange(customerCurrentPage - 1)}
                                disabled={customerCurrentPage === 1}
                                className="flex items-center justify-center p-2"
                            >
                                <ChevronLeftIcon className="h-6 w-6" />
                            </button>

                            {Array.from({ length: endPage - startPage + 1 }).map(
                                (_, index) => {
                                    const page = startPage + index;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`mx-1 rounded px-3 py-1 ${page === customerCurrentPage
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                            )}

                            <button
                                onClick={() => handlePageChange(customerCurrentPage + 1)}
                                disabled={customerCurrentPage === customerPaginationNumber}
                                className="flex items-center justify-center p-2"
                            >
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="col-span-2 mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-navy-800">
                        <h1 className="text-lg font-semibold">Customer</h1>
                        <div className="mt-2 text-sm text-gray-600">No data available</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerList;
