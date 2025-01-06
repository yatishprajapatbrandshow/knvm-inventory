import React, { useEffect, useState } from "react";
import Navbar from "pages/Navbar";
import { API_NEW_URL, X_API_Key } from "../config";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
function AllData() {
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
        // console.log(data);

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

  const { startPage, endPage } = calculatePageRange(
    productCurrentPage,
    productPaginationNumber
  );
  //  Receipts List Logic

  const [Recipt, setRecipt] = useState([]);
  const [TotalRecipt, setTotalRecipt] = useState(0);
  const [ReciptPaginationNumber, setReciptPaginationNumber] = useState(0);
  const [ReciptCurrentPage, setReciptCurrentPage] = useState(1);

  const itemsPerPage1 = 10000000000;
  const pageRange1 = 6; // Number of pagination buttons to show

  useEffect(() => {
    const fetchReceipts = async () => {
      const apiUrl = `${API_NEW_URL}receipt/list?page=${ReciptCurrentPage}&limit=${itemsPerPage1}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
        const data = await response.json();
        // console.log(data);
        if (data.status === true) {
          setRecipt(data.receipts);
          setTotalRecipt(data.total);
          setReciptPaginationNumber(Math.ceil(data.total / itemsPerPage1));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchReceipts();
  }, [ReciptCurrentPage]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // Calculate the range of pages to display for each type
  const calculatepageRange1 = (currentPage, paginationNumber) => {
    const halfRange = Math.floor(pageRange1 / 2);
    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(startPage + pageRange1 - 1, paginationNumber);

    if (endPage - startPage + 1 < pageRange1) {
      startPage = Math.max(endPage - pageRange1 + 1, 1);
    }

    return { startPage, endPage };
  };

  const handlePageChange1 = (type, newPage) => {
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
    calculatepageRange1(ReciptCurrentPage, ReciptPaginationNumber);

  const [Deliveries, setDeliveries] = useState([]);
  const [DeliveriesPaginationNumber, setDeliveriesPaginationNumber] =
    useState(0);
  const [DeliveriesCurrentPage, setDeliveriesCurrentPage] = useState(1);

  // const itemsPerPage3 = 1000;
  const pageRange3 = 6; // Number of pagination buttons to show

  // Fetch data for Deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      const apiUrl = `${API_NEW_URL}delivery/getDelivery`;
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
          setDeliveries(data.goods);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDeliveries();
  }, [DeliveriesCurrentPage]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // Calculate the range of pages to display
  const calculatepageRange3 = (currentPage, paginationNumber) => {
    const halfRange = Math.floor(pageRange3 / 2);
    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(startPage + pageRange3 - 1, paginationNumber);

    if (endPage - startPage + 1 < pageRange3) {
      startPage = Math.max(endPage - pageRange3 + 1, 1);
    }

    return { startPage, endPage };
  };

  // Handle page change
  const handlePageChange3 = (newPage) => {
    if (newPage > 0 && newPage <= DeliveriesPaginationNumber) {
      setDeliveriesCurrentPage(newPage);
    }
  };

  const { startPage: deliveriesStartPage, endPage: deliveriesEndPage } =
    calculatepageRange3(DeliveriesCurrentPage, DeliveriesPaginationNumber);

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

  const itemsPerPage4 = 10000;
  const pageRange4 = 6; // Number of pagination buttons to show

  // Fetch data for Invoices
  useEffect(() => {
    if (isSearching) return; // Skip fetching general invoices if searching

    const fetchInvoices = async () => {
      const apiUrl = `${API_NEW_URL}invoice/list?page=${InvoiceCurrentPage}&limit=${itemsPerPage4}&status=${status}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
        const data = await response.json();
        // console.log("Invoice Data", data);
        if (data.status === true) {
          setInvoice(data.invoice);
          setInvoicePaginationNumber(Math.ceil(data.total / itemsPerPage4));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchInvoices();
  }, [InvoiceCurrentPage, status, isSearching]);

  // Handle Page Change
  const handlePageChange44 = (type, newPage) => {
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
      const apiUrl = `${API_NEW_URL}invoice/list?invoiceNumber=${searchValue}&page=${SearchCurrentPage}&limit=${itemsPerPage4}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
        const data = await response.json();
        // console.log("Search Invoice Data", data);
        if (data.status === true) {
          setSearchResults(data.invoice);
          setSearchPaginationNumber(Math.ceil(data.total / itemsPerPage4));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSearchResults();
  }, [SearchCurrentPage, searchValue]);

  const calculatepageRange4 = (currentPage, paginationNumber) => {
    const halfRange = Math.floor(pageRange4 / 2);
    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(startPage + pageRange4 - 1, paginationNumber);

    if (endPage - startPage + 1 < pageRange4) {
      startPage = Math.max(endPage - pageRange4 + 1, 1);
    }

    return { startPage, endPage };
  };

  const { startPage: invoiceStartPage, endPage: invoiceEndPage } =
    calculatepageRange4(InvoiceCurrentPage, InvoicePaginationNumber);

  const { startPage: searchStartPage, endPage: searchEndPage } =
    calculatepageRange4(SearchCurrentPage, SearchPaginationNumber);

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
      const apiUrl = `${API_NEW_URL}invoice/list?invoiceNumber=${value}&page=1&limit=${itemsPerPage4}`;
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
        });
        const data = await response.json();
        // console.log("Search Invoice Data", data);
        if (data.status === true) {
          setSearchResults(data.invoice);
          setSearchPaginationNumber(Math.ceil(data.total / itemsPerPage4));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSearchResults();
  };

  // Helper function to format date
  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "short", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  return (
    <div className="mx-auto p-5">
      <Navbar
        logoText={"Medhouse Pharma - Inventory Management System"}
        brandText={"All Data"}
      />
      {/* <div className="col-span-2 h-fit w-full xl:+col-span-2 2xl:col-span-2">
        <div className="flex w-full justify-end rounded-lg bg-white p-2 px-10">
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
                  <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                    Name
                  </th>
                  <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                    Brand
                  </th>
                  <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                    SKU
                  </th>
                  <th className="w-auto p-3 text-left font-dm text-sm font-bold text-gray-900">
                    Barcode
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                      {product.name}
                    </td>
                    <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900">
                      {product.brand}
                    </td>
                    <td className="w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-sm font-normal text-gray-900  ">
                      {product.sku}
                    </td>
                    <td className="libre-barcode-39-text-regular w-auto border-b-[1px] border-l-gray-300 p-1 text-left font-dm text-2xl font-normal  text-gray-900">
                      {product.sku}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                      className={`mx-1 rounded px-3 py-1 ${
                        page === productCurrentPage
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
      </div> */}

      {/* Reciepts List */}
      {/* <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
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
                        {item.scheduledDate
                          ? formatDate(item.scheduledDate)
                          : null}
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
                  handlePageChange1("receipt", ReciptCurrentPage - 1)
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
                      onClick={() => handlePageChange1("receipt", page)}
                      className={`mx-1 rounded px-3 py-1 ${
                        page === ReciptCurrentPage
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
                  handlePageChange1("receipt", ReciptCurrentPage + 1)
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
      </div> */}

      {/* Deliviries */}
      <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
        {Deliveries.length ? (
          <div className="mt-5 h-full rounded-[20px] bg-white p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
            <div className="rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
              Total Data
            </div>
            <table className="w-full table-auto overflow-hidden">
              <thead>
                <tr className="border-2 border-gray-800">
                  <th className="w-auto border-r-2  border-gray-900 p-0 text-center font-dm text-xs font-bold text-gray-900">
                    Sku
                  </th>
                  <th className="w-auto border-r-2  border-gray-900 p-0 text-center font-dm text-xs font-bold text-gray-900">
                    Batch
                  </th>
                  <th className="w-auto border-r-2  border-gray-900 p-0 text-center font-dm text-xs font-bold text-gray-900">
                    Invoice Date
                  </th>
                  <th className="w-auto border-r-2  border-gray-900 p-0 text-center font-dm text-xs font-bold text-gray-900">
                    Invoice Number
                  </th>
                  <th className="w-auto border-r-2  border-gray-900 p-0 text-center font-dm text-xs font-bold text-gray-900">
                    Delivery Date
                  </th>
                  <th className="w-auto border-r-2  border-gray-900 p-0 text-center font-dm text-xs font-bold text-gray-900">
                    Delivery Reference
                  </th>
                  <th className="w-auto border-r-2  border-gray-900 p-0 text-center font-dm text-xs font-bold text-gray-900">
                    Total Unit Quantity
                  </th>
                  <th className="w-auto border-r-2  border-gray-900 p-0 text-center font-dm text-xs font-bold text-gray-900">
                    Product Name
                  </th>
                  {/* <th className="w-auto p-3 text-left font-dm text-xs font-bold text-gray-900">
                    Source Document
                  </th> */}
                  {/* <th className="w-auto p-3 text-left font-dm text-xs font-bold text-gray-900">
                    Company
                  </th>
                  <th className="w-auto p-3 text-left font-dm text-xs font-bold text-gray-900">
                    Invoice Number
                  </th>
                  <th className="w-auto p-3 text-left font-dm text-xs font-bold text-gray-900">
                    Total Amount
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {Deliveries.map((item, index) => (
                  <tr key={index} className="border-2 border-gray-800">
                    <td className="mb-2 w-auto border-r-2 border-gray-900 p-0  text-center font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.sku}
                      </button>
                    </td>
                    <td className="mb-2 w-auto border-r-2 border-gray-900 p-0  text-center font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.batch}
                      </button>
                    </td>
                    <td className="mb-2 w-auto border-r-2 border-gray-900 p-0  text-center  font-dm text-xs font-normal text-gray-900 ">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.invoice?.invoiceDate?.split("T")[0]}
                      </button>
                    </td>
                    <td className="mb-2 w-auto border-r-2 border-gray-900 p-0  text-center  font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.invoice?.invoiceNumber}
                      </button>
                    </td>
                    <td className="mb-2 w-auto border-r-2 border-gray-900 p-0  text-center  font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.delivery?.scheduledDate?.split("T")[0]}
                      </button>
                    </td>
                    <td className="mb-2 w-auto border-r-2 border-gray-900 p-0  text-center  font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.delivery?.reference}
                      </button>
                    </td>
                    <td className="mb-2 w-auto border-r-2 border-gray-900 p-0  text-center  font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.quantity}
                      </button>
                    </td>
                    <td className="mb-2 w-auto border-r-2 border-gray-900 p-0  text-center  font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.product?.name}
                      </button>
                    </td>
                    {/* <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item.companyDetails?.companyName}
                      </button>
                    </td> */}
                    {/* <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-xs font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.invoice?.invoiceNumber
                          ? item.invoice.invoiceNumber
                          : "No Invoice Number"}
                      </button>
                    </td> */}
                    {/* <td className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900">
                      <button
                      // onClick={() =>
                      //   navigate("/deliveries", {
                      //     state: { reference: item },
                      //   })
                      // }
                      >
                        {item?.invoice?.totalAmount}
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            {DeliveriesPaginationNumber > 1 && (
              <div className="mt-5 flex flex-wrap items-center justify-center">
                <button
                  onClick={() => handlePageChange3(DeliveriesCurrentPage - 1)}
                  disabled={DeliveriesCurrentPage === 1}
                  className="flex items-center justify-center p-2"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>

                {Array.from({ length: DeliveriesPaginationNumber }).map(
                  (_, index) => {
                    const page = index + 1;
                    return page >= deliveriesStartPage &&
                      page <= deliveriesEndPage ? (
                      <button
                        key={index}
                        onClick={() => handlePageChange3(page)}
                        className={`mx-1 rounded px-3 py-1 ${
                          page === DeliveriesCurrentPage
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
                  onClick={() => handlePageChange3(DeliveriesCurrentPage + 1)}
                  disabled={
                    DeliveriesCurrentPage === DeliveriesPaginationNumber
                  }
                  className="flex items-center justify-center p-2"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="col-span-2 mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-navy-800">
            <h1 className="text-lg font-semibold">Total Data</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="50"
              height="50"
              class="spinner"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#3498db"
                stroke-width="5"
                stroke-linecap="round"
                stroke-dasharray="100"
                stroke-dashoffset="0"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="502"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-dasharray"
                  values="150,200;50,150;100,50"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke"
                  values="#3498db;#9b59b6;#e74c3c;#3498db"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        )}
      </div>

      {/* Invoice List */}
      {/* <div>
        <div className="col-span-2 h-fit w-full xl:col-span-2 2xl:col-span-2">
          <div className="col-span-2 mt-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-navy-800">
            <div className="flex items-center justify-between rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
              <div className="flex h-max items-center justify-center gap-4">
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
                  className="h-10 w-max rounded-lg border bg-white px-4 py-2 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option className="text-sm font-bold" value="All">
                    All
                  </option>
                  <option className="text-sm font-bold" value="Approved">
                    Approved
                  </option>
                  <option className="text-sm font-bold" value="Profarma">
                    Profarma
                  </option>
                  <option className="text-sm font-bold" value="Void">
                    Void
                  </option>
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
                    {(isSearching ? SearchResults : Invoice).map(
                      (item, index) => (
                        <tr key={index}>
                          <td
                            onClick={() =>
                              navigate("/invoice", {
                                state: { reference: item },
                              })
                            }
                            className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                          >
                            {item.invoiceNumber}
                          </td>
                          <td
                            onClick={() =>
                              navigate("/invoice", {
                                state: { reference: item },
                              })
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
                              navigate("/invoice", {
                                state: { reference: item },
                              })
                            }
                            className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                          >
                            {item.paymentTerm}
                          </td>
                          <td
                            onClick={() =>
                              navigate("/invoice", {
                                state: { reference: item },
                              })
                            }
                            className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                          >
                            {item.invoiceDate
                              ? formatDate(item.invoiceDate)
                              : null}
                          </td>
                          <td
                            onClick={() =>
                              navigate("/invoice", {
                                state: { reference: item },
                              })
                            }
                            className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                          >
                            {item.totalAmount}
                          </td>
                          <td
                            onClick={() =>
                              navigate("/invoice", {
                                state: { reference: item },
                              })
                            }
                            className="mb-2 w-auto border-b-[1px] border-l-gray-300 p-3 text-left font-dm text-sm font-normal text-gray-900"
                          >
                            {item.status}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>

                {(isSearching
                  ? SearchPaginationNumber
                  : InvoicePaginationNumber) > 1 && (
                  <div className="mt-5 flex flex-wrap items-center justify-center">
                    <button
                      onClick={() =>
                        handlePageChange44(
                          isSearching ? "search" : "invoice",
                          (isSearching
                            ? SearchCurrentPage
                            : InvoiceCurrentPage) - 1
                        )
                      }
                      disabled={
                        (isSearching
                          ? SearchCurrentPage
                          : InvoiceCurrentPage) === 1
                      }
                      className="flex items-center justify-center p-2"
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>

                    {Array.from({
                      length: isSearching
                        ? SearchPaginationNumber
                        : InvoicePaginationNumber,
                    }).map((_, index) => {
                      const page = index + 1;
                      const startPage = isSearching
                        ? searchStartPage
                        : invoiceStartPage;
                      const endPage = isSearching
                        ? searchEndPage
                        : invoiceEndPage;
                      const currentPage = isSearching
                        ? SearchCurrentPage
                        : InvoiceCurrentPage;

                      return page >= startPage && page <= endPage ? (
                        <button
                          key={index}
                          onClick={() =>
                            handlePageChange44(
                              isSearching ? "search" : "invoice",
                              page
                            )
                          }
                          className={`mx-1 rounded px-3 py-1 ${
                            page === currentPage
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      ) : null;
                    })}

                    <button
                      onClick={() =>
                        handlePageChange44(
                          isSearching ? "search" : "invoice",
                          (isSearching
                            ? SearchCurrentPage
                            : InvoiceCurrentPage) + 1
                        )
                      }
                      disabled={
                        (isSearching
                          ? SearchCurrentPage
                          : InvoiceCurrentPage) ===
                        (isSearching
                          ? SearchPaginationNumber
                          : InvoicePaginationNumber)
                      }
                      className="flex items-center justify-center p-2"
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mt-2 text-sm text-gray-600">
                  No data available
                </div>
              </>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default AllData;
