import React, { useEffect, useState } from "react";
import Navbar from "pages/Navbar";
import { X_API_Key } from "config";
import { API_NEW_URL } from "config";
import { motion } from "framer-motion";
function getPassedMonths() {
  const now = new Date();
  const currentMonth = now.getMonth(); // Current month (0 for January, 11 for December)

  // Array of all month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Return all months from the start of the year to the current month (inclusive)
  return months.slice(0, currentMonth + 1);
}

function TotalSell() {
  const [totalSell, setTotalSell] = useState([]);
  const [searchBy, setSearchBy] = useState("total");
  const [searchByMonth, setSearchByMonth] = useState("total");
  const [searchBy1, setSearchBy1] = useState("total");
  const [searchBysearchterm, setSearchBysearchterm] = useState("");
  const [endDate, setEndDate] = useState();
  const [startDate, setStartDate] = useState();
  const fetchApi = async () => {
    let apiUrl = `${API_NEW_URL}sell?date=${searchBy}&&status=${searchBy1}&&searchterm=${searchBysearchterm.trim()}`;
    if (startDate && endDate) {
      apiUrl = `${API_NEW_URL}sell?date=total&&status=${searchBy1}&&searchterm=${searchBysearchterm.trim()}&&startDate=${startDate}&&endDate=${endDate}`;
    }
    if (searchByMonth !== "total") {
      apiUrl = `${API_NEW_URL}sell?date=total&&status=${searchBy1}&&searchterm=${searchBysearchterm.trim()}&&monthwise=${searchByMonth}`;
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
      console.log(data);
      
      if (data.status === true) {
        setTotalSell(data.data);
      } else {
        setTotalSell([]);
      }
    } catch (error) {
      console.log(error);
      setTotalSell([]);
    }
  };

  // useEffect(() => {
  //   setEndDate(null);
  //   setStartDate(null);
  // },[searchBy])
  const handleSearchByChange = (e) => {
    setEndDate("");
    setStartDate("");
    setSearchBy(e.target.value);
  };
  const handleSearchByMonthChange = (e) => {
    setEndDate("");
    setStartDate("");
    setSearchByMonth(e.target.value);
  };
  useEffect(() => {
    if (startDate && endDate) {
      // Check if start date is greater than end date
      if (new Date(startDate) > new Date(endDate)) {
        alert("End date should be greater than start date");
        setEndDate("");
        setStartDate("");
        return;
      }
      setSearchBy("total");
      setSearchByMonth("total");
    }
    fetchApi();
  }, [
    searchBy,
    searchBy1,
    searchBysearchterm,
    startDate,
    endDate,
    searchByMonth,
  ]);
  const resetFilters = () => {
    setEndDate("");
    setStartDate("");
    setSearchBy("total");
    setSearchByMonth("total");
    setSearchBy1("total");
    setSearchBysearchterm("");
  };
  return (
    <div className="mx-auto p-5">
      <Navbar
        logoText={"Medhouse Pharma - Inventory Management System"}
        brandText={"Total Sell Details"}
      />
      <div className=" mt-5 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 p-8 shadow-2xl backdrop-blur-lg ">
        <div className="mb-4 flex gap-8">
          <div className="flex-grow">
            <label
              htmlFor="search"
              className=" mb-2 block text-sm font-semibold text-gray-700"
            >
              Search :
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="focus:border-transparent block w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-700 shadow-sm backdrop-blur-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Search..."
                value={searchBysearchterm}
                onChange={(e) => setSearchBysearchterm(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="w-max">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Filter Invoices By Date:
            </label>
            <div className="relative w-max">
              <select
                id="filter"
                className="focus:border-transparent block w-max appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-3 pr-10 text-gray-700 shadow-sm backdrop-blur-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={handleSearchByChange}
                value={searchBy}
              >
                <option value="total">All Invoices</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisweek">This Week</option>
                <option value="lastweek">Last Week</option>
                <option value="thismonth">This Month</option>
                <option value="lastmonth">Last Month</option>
                <option value="thisyear">This Year</option>
                <option value="lastyear">Last Year</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  fill="#7683B2"
                  className=" h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-max">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Filter Invoices By Status:
            </label>
            <div className="relative w-max">
              <select
                id="filter"
                className="focus:border-transparent block w-max appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-3 pr-10 text-gray-700 shadow-sm backdrop-blur-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setSearchBy1(e.target.value)}
                value={searchBy1}
              >
                <option value="total">All Invoices</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  fill="#7683B2"
                  className=" h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-max">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Filter Invoices By Start Date:
            </label>
            <div className="relative w-max">
              <input
                type="date"
                id="start-date"
                className="focus:border-transparent block w-max appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-700 shadow-sm backdrop-blur-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
              />
            </div>
          </div>
          <div className="w-max">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Filter Invoices By End Date:
            </label>
            <div className="relative w-max">
              <input
                type="date"
                id="end-date"
                className="focus:border-transparent block w-max appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-700 shadow-sm backdrop-blur-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setEndDate(e.target.value)}
                value={endDate}
              />
            </div>
          </div>
          <div className="w-max">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Filter Invoices By Month:
            </label>
            <div className="relative w-max">
              <select
                id="filter"
                className="focus:border-transparent block w-max appearance-none rounded-xl border border-gray-200 bg-white/50 px-4 py-3 pr-10 text-gray-700 shadow-sm backdrop-blur-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={handleSearchByMonthChange}
                value={searchByMonth}
              >
                <option value="total">Select Month</option>
                {getPassedMonths().map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
                {/* <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="thisweek">This Week</option>
                <option value="lastweek">Last Week</option>
                <option value="thismonth">This Month</option>
                <option value="lastmonth">Last Month</option>
                <option value="thisyear">This Year</option>
                <option value="lastyear">Last Year</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  fill="#7683B2"
                  className=" h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-max">
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Reset Filters:
            </label>
            <div className="relative w-max">
              <button onClick={(e)=>{
                e.preventDefault();
                resetFilters();
                fetchApi();
              }} className="focus:border-transparent flex gap-2 w-max appearance-none rounded-xl border border-gray-200 bg-white/50 px-2 py-3  text-gray-700 shadow-sm backdrop-blur-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400">Reset <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter-x"><path d="M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055"/><path d="m22 3-5 5"/><path d="m17 3 5 5"/></svg></button>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border-2 border-gray-300 bg-white/30 shadow-2xl backdrop-blur-lg">
          <div className="hidden bg-gray-100/50 p-4 font-semibold text-gray-700 md:grid md:grid-cols-8 md:gap-4 ">
            <div>Sr No .</div>
            <div>Customer</div>
            <div>Invoice Date</div>
            <div>Invoice Number</div>
            <div>Payment Term</div>
            <div>Total Amount</div>
            <div>Paid Amount</div>
            <div>Pending Amount</div>
          </div>
          {totalSell.length > 0 && (
            <>
              <div className="h-[66vh] overflow-auto">
                {totalSell.map((invoice, index) => (
                  <motion.div
                    key={invoice.invoiceNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={`p-4 md:grid md:grid-cols-8 md:gap-4 ${
                      index % 2 === 0 ? "bg-white/20" : "bg-white/10"
                    } border-b border-gray-200 backdrop-blur-md transition duration-150 ease-in-out hover:bg-white/30`}
                  >
                    <div className="mb-2 flex justify-between md:mb-0 md:block">
                      <span className="font-medium text-gray-600 md:hidden">
                        Sr No.:
                      </span>
                      <span className="text-gray-800">{index + 1}</span>
                    </div>
                    <div className="mb-2 flex justify-between md:mb-0 md:block">
                      <span className="font-medium text-gray-600 md:hidden">
                        Invoice Date:
                      </span>
                      <span className="text-gray-800">
                        {invoice?.customer?.name}
                      </span>
                    </div>
                    <div className="mb-2 flex justify-between md:mb-0 md:block">
                      <span className="font-medium text-gray-600 md:hidden">
                        Invoice Date:
                      </span>
                      <span className="text-gray-800">
                        {invoice?.invoiceDate?.split("T")[0]}
                      </span>
                    </div>
                    <div className="mb-2 flex justify-between md:mb-0 md:block">
                      <span className="font-medium text-gray-600 md:hidden">
                        Invoice Number:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <div className="mb-2 flex justify-between md:mb-0 md:block">
                      <span className="font-medium text-gray-600 md:hidden">
                        Payment Term:
                      </span>
                      <span className="text-gray-800">
                        {invoice.paymentTerm}
                      </span>
                    </div>
                    <div className="mb-2 flex justify-between md:mb-0 md:block">
                      <span className="font-medium text-gray-600 md:hidden">
                        Total Amount:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {invoice.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="mb-2 flex justify-between md:mb-0 md:block">
                      <span className="font-medium text-gray-600 md:hidden">
                        Paid Amount:
                      </span>
                      <span className="font-semibold text-gray-800">
                        {invoice.totalPaid.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between md:block">
                      <span className="font-medium text-gray-600 md:hidden">
                        Pending Amount:
                      </span>
                      <span
                        className={`font-semibold ${
                          invoice.pendingAmount > 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {invoice.pendingAmount.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="hidden bg-gray-100/50 p-4 font-semibold text-gray-700 md:grid md:grid-cols-6 md:gap-4 ">
                <div>Total</div>
                <div>-</div>
                <div>-</div>
                <div>
                  {totalSell
                    .reduce((acc, curr) => acc + curr.totalAmount, 0)
                    .toFixed(2)}
                </div>
                <div>
                  {" "}
                  {totalSell
                    .reduce((acc, curr) => acc + curr.totalPaid, 0)
                    .toFixed(2)}
                </div>
                <div>
                  {totalSell
                    .reduce((acc, curr) => acc + curr.pendingAmount, 0)
                    .toFixed(2)}
                </div>
              </div>
            </>
          )}
        </div>
        {totalSell.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 rounded-xl bg-white/30 py-8 text-center font-semibold text-gray-600 shadow-lg backdrop-blur-md"
          >
            No invoices found for the selected period.
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default TotalSell;
