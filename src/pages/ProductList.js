import React, { useEffect, useState } from 'react';
import Navbar from "pages/Navbar";
import { API_NEW_URL, X_API_Key } from "../config";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
function ProductList() {
    const [products, setProducts] = useState([]);
    const [productPaginationNumber, setProductPaginationNumber] = useState(0);
    const [productCurrentPage, setProductCurrentPage] = useState(1);
    const itemsPerPage = 100;
    const pageRange = 6; // Number of pagination buttons to show
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const apiUrl = `${API_NEW_URL}product/list?page=${productCurrentPage}&limit=${itemsPerPage}`;
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
                    setProducts(data.products);
                    setProductPaginationNumber(data.totalPages);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchProducts();
    }, [productCurrentPage]);

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
        if (newPage > 0 && newPage <= productPaginationNumber) {
            setProductCurrentPage(newPage);
        }
    };
    const handlePrintNextPage = () => {

        const DataToSend = {
            ChallanName: "Product List",
            products: products,
        };
        if (!DataToSend.products.length) {
            alert("Not Products to Print");
            return;
        }
        navigate("/productListPrint", { state: { data: DataToSend } });
    };

    const { startPage, endPage } = calculatePageRange(productCurrentPage, productPaginationNumber);

    return (
        <div className='mx-auto p-5'>
            <Navbar
                logoText={"Medhouse Pharma - Inventory Management System"}
                brandText={"Product List"}
            />
            <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
                <div className='w-full flex justify-end px-10 bg-white p-2 rounded-lg' >
                    <button
                        onClick={handlePrintNextPage}
                        className="border-transparent inline-flex items-center gap-x-2 rounded-lg border bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                    >
                        <svg
                            className="size-4 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect width="12" height="8" x="6" y="14"></rect>
                        </svg>
                        Print
                    </button>
                </div>
                {products.length ? (
                    <div className="mt-5 h-full rounded-[20px] bg-white p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
                        <div className="rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
                            Products
                        </div>
                        <table className="w-full table-auto overflow-hidden">
                            <thead>
                                <tr>
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Name</th>
                                    {/* <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Description</th> */}
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Brand</th>
                                    {/* <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Category</th> */}
                                    {/* <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Price</th> */}
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">SKU</th>
                                    <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">Barcode</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>

                                        <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                                            {product.name}
                                        </td>
                                        {/* <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                                            {product.description}
                                        </td> */}
                                        <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                                            {product.brand}
                                        </td>
                                        {/* <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                                            {product.category}
                                        </td> */}
                                        {/* <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                                            {product.defaultPrice}
                                        </td> */}
                                        <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900  ">
                                            {product.sku}
                                        </td>
                                        <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm font-normal text-gray-900 libre-barcode-39-text-regular  text-2xl">
                                            {product.sku}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="mt-5 flex flex-wrap items-center justify-center">
                            <button
                                onClick={() => handlePageChange(productCurrentPage - 1)}
                                disabled={productCurrentPage === 1}
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
                                            className={`mx-1 rounded px-3 py-1 ${page === productCurrentPage
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
                                onClick={() => handlePageChange(productCurrentPage + 1)}
                                disabled={productCurrentPage === productPaginationNumber}
                                className="flex items-center justify-center p-2"
                            >
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="col-span-2 mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-navy-800">
                        <h1 className="text-lg font-semibold">Products</h1>
                        <div className="mt-2 text-sm text-gray-600">No data available</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;
