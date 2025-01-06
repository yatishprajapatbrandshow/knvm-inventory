import Navbar from "pages/Navbar";
import React, { useEffect, useState } from "react";
import { API_NEW_URL, X_API_Key } from "../config";

const InvoiceSearch = () => {
  const [searchInvoice, setSearchInvoice] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  // Payement Process
  const [amountReceived, setAmountReceived] = useState("");
  const [bankCharges, setBankCharges] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [pcdCheckDate, setpcdCheckDate] = useState("");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cheque Current");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [addedTransactions, setAddedTransactions] = useState([]);
  const [customerData, setCustomerData] = useState({});
  const [totalAddedAmount, setTotalAddedAmount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const reference = {
    // invoiceId: "66c4792ecb73c47491bd0e89",
    // customerId: "667a4b56f9231d4078e866d4",
    // totalAmount: 100,
    // invoiceNumber: "Testing",
  };

  useEffect(() => {
    if (addedTransactions) {
      let total = 0;
      addedTransactions.forEach((item) => {
        total += item.amount;
      });
      setTotalAddedAmount(total);
      setIsDisabled(total >= reference.totalAmount);
    }
  }, [addedTransactions]);

  useEffect(() => {
    async function fetchData() {
      if (reference && reference.invoiceId && reference.customerId) {
        const apiUrl = `${API_NEW_URL}payment/getByid`;
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": X_API_Key,
            },
            body: JSON.stringify({
              invoiceId: reference.invoiceId,
              customerId: reference.customerId,
            }),
          });

          const data = await response.json();
          console.log(data);

          if (data.status === true) {
            setAddedTransactions(data.paymentData);
          } else {
            setError("No payment data found");
            setAddedTransactions([]);
          }
        } catch (error) {
          console.log(error);
          setError("Failed to fetch payment data");
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (selectedInvoice) {
      getPaymentData();
      getCustomerData(selectedInvoice.customer);
    }
  }, [selectedInvoice]);
  const refreshState = () => {
    setAmountReceived("");
    setBankCharges("");
    setPaymentDate("");
    setpcdCheckDate("");
    setPaymentNumber("");
    setPaymentMode("Cheque Current");
    setReferenceNumber("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPayment();
    refreshState();
    await getPaymentData();
  };

  const getPaymentData = async () => {
    const apiUrl = `${API_NEW_URL}payment/getByid`;
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify({
          invoiceId: selectedInvoice._id,
          customerId: selectedInvoice.customer,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.status === true) {
        setAddedTransactions(data.paymentData);
      } else {
        setError("No payment data found");
        setAddedTransactions([]);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch payment data");
    } finally {
      setIsLoading(false);
    }
  };
  const getCustomerData = async () => {
    const apiUrl = `${API_NEW_URL}customer/get/${selectedInvoice.customer}`;
    try {
      setIsLoading(true);
      setError("");

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
        setCustomerData(data.customerData);
      } else {
        setError("Customer Not Found!");
        setCustomerData({});
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch Customer data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Added Transactions:", addedTransactions);
  }, [addedTransactions]);

  const createPayment = async () => {

    if (!selectedInvoice) {
      alert("Please select invoice to make payment");
      return;
    }

    const datas = {
      invoiceId: selectedInvoice._id,
      amount: parseFloat(amountReceived),
      customerId: selectedInvoice.customer,
      transactionDate: paymentDate,
      documentDate: pcdCheckDate,
      mode: paymentMode,
    };
    console.log(datas);


    try {
      setIsLoading(true);
      setError("");
      const apiUrl = `${API_NEW_URL}payment/add`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      console.log(data);

      if (data.status === true) {
        console.log(data);
        alert("Payment Created successfully");
        setInvoiceData(data.InvoiceData);
      } else if (data.status === false) {
        setError(data.message);
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch invoice data");
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoiceData = async (invoiceNumber) => {
    const apiUrl = `${API_NEW_URL}invoice/getByInvoice`;
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify({
          invoiceNumber,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.status === true) {
        setInvoiceData(data.InvoiceData);
      } else {
        setError("Invoice not found");
        setInvoiceData(null);
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch invoice data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value.trim();
    setSearchInvoice(value);

    if (value.length >= 3) {
      await getInvoiceData(value);
    } else {
      setInvoiceData(null);
      setError("");
    }
  };

  return (
    <>
      <div className="mx-auto p-5">
        <Navbar
          logoText={"Medhouse Pharma - Inventory Management System"}
          brandText={"Record Payment"}
        />
        <div className="mx-auto mt-5 max-w-[85rem] rounded-lg bg-white sm:p-6 lg:p-8">
          <div className="dark:border-neutral-700 mb-5 flex items-center justify-between border-b  border-gray-200 pb-5">
            <div className="flex w-full items-center justify-between gap-x-2">
              <div>
                <p className="text-xl font-bold leading-5 text-gray-800">
                  Medhouse Pharma{" "}
                  <span className="block font-normal">
                    Inventory Management System
                  </span>
                </p>
              </div>
            </div>
          </div>
          <dl className="grid gap-x-3 text-sm sm:flex">
            <label className="dark:text-neutral-500 min-w-[120px] text-gray-600">
              Search Invoice
            </label>
            <div>
              <input
                className={`mb-2 block w-full flex-1 rounded-lg border border-gray-300 bg-gray-50
                                p-2.5 text-sm text-gray-900 `}
                type="text"
                value={searchInvoice}
                onChange={(e) => {
                  setSelectedInvoice(null);
                  setAddedTransactions([]);
                  refreshState();
                  handleSearchChange(e)
                }}
                placeholder="Enter Invoice Number"
                disabled={isDisabled}
              />
            </div>
          </dl>
          {selectedInvoice && (
            <div
              className={`w-max items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-2.5 px-5 text-sm text-gray-900 mt-2`}
            >
              <div className="flex items-center justify-start  gap-2">
                <h2 className="border-r-2 border-gray-400 pr-2  text-base font-semibold text-gray-900">
                  Invoice No.:
                  <span className="text-sm text-gray-700">
                    {" "}
                    {selectedInvoice?.invoiceNumber}
                  </span>
                </h2>
                <h2 className="border-r-2 border-gray-400 pr-2  text-base font-semibold text-gray-900">
                  Invoice Date :
                  <span className="text-sm text-gray-700">
                    {" "}
                    {selectedInvoice?.invoiceDate?.split("T")[0]}
                  </span>
                </h2>
                <h2 className="border-r-2 border-gray-400 pr-2 text-base font-semibold text-gray-900">
                  Customer Name :
                  <span className="text-sm text-gray-700">
                    {" "}
                    {customerData?.name}
                  </span>
                </h2>
                <h2 className=" border-r-2 border-gray-400 pr-2 text-base font-semibold text-gray-900">
                  Total Amount:
                  <span className="text-sm text-gray-700">
                    {" "}
                    {selectedInvoice?.totalAmount}
                  </span>
                </h2>
                <h2 className="border-r-2 border-gray-400 pr-2 text-base font-semibold text-gray-900">
                  Payment Term:
                  <span className="text-sm text-gray-700">
                    {" "}
                    {selectedInvoice?.paymentTerm}
                  </span>
                </h2>
                {selectedInvoice?.paymentStatus == "Due" && (
                  <h2 className=" text-base font-semibold text-gray-900">
                    Due Payment
                    <span className="text-sm text-gray-700">
                      {" "}
                      {selectedInvoice?.dueAmount}
                    </span>
                  </h2>
                )}
                {selectedInvoice?.paymentStatus == "Completed" && (
                  <h2 className=" text-base font-semibold text-gray-900">
                    Payment Completed
                  </h2>
                )}
              </div>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="border-t-transparent h-8 w-8 animate-spin rounded-full border-4 border-blue-500"></div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {invoiceData && !selectedInvoice && (
            <div className="flex flex-wrap items-start justify-start gap-4 p-4">
              {invoiceData.map((item) => {
                return (
                  <div
                    key={item.invoiceNumber}
                    onClick={() => {
                      if (item.paymentStatus == "Completed") {
                        return;
                      }
                      setSelectedInvoice(item);
                    }}
                    className={`flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border-[1px] border-blue-400 bg-[#EFF6FF] shadow-lg duration-300 hover:scale-105 sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(25%-1rem)] ${item.paymentStatus == "Completed"
                      ? "cursor-not-allowed bg-green-200"
                      : ""
                      }`}
                  >
                    <div className="p-4">
                      <h2 className="text-base font-semibold text-gray-900">
                        Invoice No.:
                        <span className="text-sm text-gray-700">
                          {" "}
                          {item.invoiceNumber}
                        </span>
                      </h2> 
                      <h2 className="mt-2 text-base font-semibold text-gray-900">
                        Invoice Date :
                        <span className="text-sm text-gray-700">
                          {" "}
                          {item?.invoiceDate?.split("T")[0]}
                        </span>
                      </h2>
                      <h2 className="mt-2 text-base font-semibold text-gray-900">
                        Total Amount:
                        <span className="text-sm text-gray-700">
                          {" "}
                          {item.totalAmount}
                        </span>
                      </h2>
                      <h2 className="mt-2 text-base font-semibold text-gray-900">
                        Payment Term:
                        <span className="text-sm text-gray-700">
                          {" "}
                          {item.paymentTerm}
                        </span>
                      </h2>
                      {item.paymentStatus == "Due" && (
                        <h2 className="mt-2 text-base font-semibold text-gray-900">
                          Due Payment
                          <span className="text-sm text-gray-700">
                            {" "}
                            {item.dueAmount}
                          </span>
                        </h2>
                      )}
                      {item.paymentStatus == "Completed" && (
                        <h2 className="mt-2 text-base font-semibold text-gray-900">
                          Payment Completed
                        </h2>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Render Next Process after Select the Invoice */}
          <div className="max-w-xl ">
            <form
              onSubmit={handleSubmit}
              className="rounded bg-white p-6 shadow-sm"
            >
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700">
                  Amount Received*
                </label>
                <div className="flex items-center">
                  {/* <input
                    type="text"
                    value="INR"
                    disabled
                    className="w-16 rounded-l border border-gray-300 bg-gray-100 px-3 py-2"
                  /> */}
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={selectedInvoice?.totalAmount}
                    value={amountReceived}

                    onChange={(e) => {
                      if (e.target.value > selectedInvoice?.totalAmount) {
                        alert(
                          "Amount received cannot be greater than invoice amount"
                        );
                        return;
                      }
                      setAmountReceived(e.target.value);
                    }}
                    className="w-full rounded-r border border-gray-300 px-3 py-2"
                    required
                    disabled={isDisabled}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700">
                  Bank Charges (if any)
                </label>
                <input
                  type="text"
                  value={bankCharges}
                  onChange={(e) => setBankCharges(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  disabled={isDisabled}
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700">
                  Payment Date*
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                  disabled={isDisabled}
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setPaymentMode(e.target.value);

                  }}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  disabled={isDisabled}
                >
                  <option value="Cheque Current">Cheque Current</option>
                  <option value="Cheque PDC">Cheque PDC</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Momo">Momo</option>
                </select>
              </div>
              {paymentMode === "Cheque PDC" && (
                <div className="mb-4">
                  <label className="mb-2 block font-medium text-gray-700">
                    PCD Cheque Date*
                  </label>
                  <input
                    type="date"
                    value={pcdCheckDate}
                    onChange={(e) => setpcdCheckDate(e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="rounded bg-green-500 py-2 px-4 font-medium text-white hover:bg-green-600"
                disabled={isDisabled}
              >
                Save
              </button>
              {/* <button
                type="button"
                className="ml-2 rounded bg-gray-300 py-2 px-4 font-medium text-gray-700 hover:bg-gray-400"
                disabled={isDisabled}
              >
                Cancel
              </button> */}
            </form>
          </div>
          {/* Transaction Details */}
          <div className="max-w-max p-4">
            <div className="rounded bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium text-gray-700">
                  Transaction History
                </h3>
              </div>

              <table className="w-full table-fixed text-left">
                <thead className="border-b text-gray-500">
                  <tr>
                    <th className="w-1/6 py-2">Date</th>
                    <th className="w-1/4 py-2">Invoice Number</th>
                    <th className="w-1/4 py-2">Transaction Amount</th>
                    <th className="w-1/6 py-2">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {addedTransactions && addedTransactions.length > 0 ? (
                    addedTransactions.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="py-2">
                          {item?.transactionDate.split("T")[0]}
                        </td>
                        <td className="py-2">
                          {console.log(selectedInvoice?.invoiceNumber)
                          }
                          {selectedInvoice?.invoiceNumber ||
                            reference.invoiceNumber}
                        </td>
                        <td className="py-2">{item.amount}</td>
                        <td className="py-2">{item.mode}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 text-center text-gray-500"
                      >
                        There are no transactions associated with this invoice.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {selectedInvoice &&
            totalAddedAmount >= selectedInvoice.totalAmount && (
              <div className="fixed bottom-0 left-0 w-full bg-green-500 p-4 text-center text-white">
                Total Transaction Completed!
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default InvoiceSearch;
