import { IoMdClose } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { API_NEW_URL, X_API_Key } from "../../config";
import { useNavigate } from 'react-router-dom';

function PopUp({ item, setShowPop }) {
  const [sortedData, setSortedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [Product, setProduct] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("invoice"); // Default search type

  const [totalQuantityIn, setTotalQuantityIn] = useState(0); // State for totalQuantityIn
  const [totalQuantityOut, setTotalQuantityOut] = useState(0); // State for totalQuantityOut
  const [receiptNumber, setReceiptNumber] = useState(""); // State for receiptNumber

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to fetch product details
  const getProducttoAdd = async () => {
    const apiUrl = `${API_NEW_URL}product/list?sku=${item.sku}`;
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
        setProduct(data.products[0]);
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch stock register data
  const getStockRegisterData = async () => {
    const apiUrl = `${API_NEW_URL}stock/get`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify({
          sku: item.sku,
          productId: item.productId,
        }),
      });
      const data = await response.json();
      if (data.status === true) {
        const mergedData = [...data.receipts, ...data.deliveries];
        const sortedMergedData = mergedData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        let currentRunningBalance = 0;
        let totalIn = 0; // Variable to accumulate total quantity in
        let totalOut = 0; // Variable to accumulate total quantity out
        let lastReceiptNumber = ""; // Variable to track the receipt number

        const calculatedData = [];

        for (const item of sortedMergedData) {
          if (item.receipt) {
            currentRunningBalance += item.quantity;
            totalIn += item.quantity; // Add to total quantity in
            lastReceiptNumber = item.receiptNumber || lastReceiptNumber; // Update receipt number
          } else {
            currentRunningBalance -= item.quantity;
            totalOut += item.quantity; // Add to total quantity out
          }

          calculatedData.push({
            ...item,
            runningBalance: currentRunningBalance,
          });
        }

        setSortedData(calculatedData);
        setFilteredData(calculatedData);
        setTotalQuantityIn(totalIn); // Update totalQuantityIn state
        setTotalQuantityOut(totalOut); // Update totalQuantityOut state
        setReceiptNumber(lastReceiptNumber); // Update receiptNumber state
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error fetching stock register data:", error);
    }
  };

  useEffect(() => {
    getProducttoAdd();
    getStockRegisterData();
  }, []);

  // Update filtered data based on search query and search type
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(sortedData);
    } else if (searchType === "receipt") {
      const filtered = sortedData.filter((item) =>
        item?.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else if (searchType === "batch") {
      const filtered = sortedData.filter((item) =>
        item?.batch?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else if (searchType === "invoice") {
      const filtered = sortedData.filter((item) =>
        item?.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, searchType, sortedData]);

  const FormateDate = (value) => {
    const dateObject = new Date(value);
    return `${String(dateObject.getDate()).padStart(2, "0")}-${String(
      dateObject.getMonth() + 1
    ).padStart(2, "0")}-${dateObject.getFullYear()} : ${String(
      dateObject.getHours()
    ).padStart(2, "0")}:${String(dateObject.getMinutes()).padStart(2, "0")}`;
  };

  const handlePaymentHistory = (printOnly) => {
    navigate("/stockPrintDetails", {
      state: {
        data: {
          printOnly: printOnly,
          stockData: filteredData,           // stock data
          productName: Product?.name,        // product name
          totalQuantityIn: totalQuantityIn, // total quantity in
          totalQuantityOut: totalQuantityOut, // total quantity out
          receiptNumber: receiptNumber,     // receipt number
        },
      },
    });
  };

  return (
    <div className="mx-10 h-[90vh] w-full rounded-lg bg-white p-10">
      <div className="flex w-full justify-end">
        <button onClick={() => setShowPop(false)} className="text-2xl">
          <IoMdClose />
        </button>
      </div>
      <div className="mx-auto h-full p-5">
        <div className="col-span-2 h-full w-full xl:col-span-2 2xl:col-span-2">
          <div className="flex items-center justify-between rounded-lg border-b-[1px] border-l-gray-300 bg-blue-500 px-4 py-2 text-xl font-bold text-white dark:text-white">
            <div className="flex items-center">
              <span>Stock Details</span>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="ml-4 rounded-md p-2 text-base text-gray-800 outline-none"
              >
                <option value="invoice">Search by Invoice Number</option>
                <option value="receipt">Search by Receipt</option>
                <option value="batch">Search by Batch</option>
              </select>
              <input
                type="text"
                name="search"
                id="search"
                className="ml-4 w-60 rounded-md p-2 pl-3 text-base text-gray-800 outline-none placeholder:text-gray-600"
                placeholder={`Search ${
                  {
                    receipt: "Receipt",
                    batch: "Batch",
                    invoice: "Invoice",
                  }[searchType] || "Invoice"
                } Number`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handlePaymentHistory("Both");
              }}
              className="rounded-lg bg-white py-1 px-4 font-semibold text-gray-800 transition-colors"
            >
              Print
            </button>
          </div>

          {filteredData.length ? (
            <div className=" h-full rounded-[20px] bg-white p-4 pb-10 shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
              <div className="relative h-[60vh] overflow-y-auto">
                <table className="w-full table-auto">
                  <thead className="sticky top-0 rounded-lg bg-white text-white">
                    <tr>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        Date
                      </th>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        Product Name
                      </th>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        SKU
                      </th>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        Batch
                      </th>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        Total Quantity In
                      </th>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        Receipt Number
                      </th>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        Total Quantity Out
                      </th>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        Invoice Number
                      </th>
                      <th className="p-3 text-left font-dm text-sm font-bold text-gray-900">
                        Running Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item._id}>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {FormateDate(item.createdAt)}
                        </td>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {Product?.name || "-"}
                        </td>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {item.sku}
                        </td>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {item.batch}
                        </td>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {item?.receipt ? item.quantity : "0"}
                        </td>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {item?.receiptNumber || "0"}
                        </td>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {item?.receipt ? "0" : item.quantity}
                        </td>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {item?.invoiceNumber}
                        </td>
                        <td className="p-3 text-left font-dm text-sm font-normal text-gray-900">
                          {item.runningBalance || "0"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="mt-10 text-center">No stock details available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopUp;
