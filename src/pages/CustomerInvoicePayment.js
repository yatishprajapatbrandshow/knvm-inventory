import React, { useEffect, useState } from "react";
import Navbar from "pages/Navbar";
import { API_NEW_URL, X_API_Key } from "../config";
import { useLocation, useNavigate } from "react-router-dom";

function CustomerInvoicePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer } = location.state || {};
  const [Invoice, setInvoice] = useState([]);
  const [payment, setPayment] = useState([]);
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!customer || !customer._id) return; // Exit if customer is not defined or lacks an ID

      const apiUrl = `${API_NEW_URL}customer/get-transactions`;

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": X_API_Key,
          },
          body: JSON.stringify({ customerId: customer._id }), // Use actual customer ID
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);

          setInvoice(data?.invoiceData || []); // Ensure arrays are set to avoid errors
          setPayment(data?.paymentData || []);
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchTransactions(); // Call the fetch function
  }, [customer?._id]); // Use customer._id as a dependency
  const toFind = (id) => {
    let totalAmount = 0;

    payment.forEach((item) => {
      if (item.invoiceId === id) {
        totalAmount += item.amount;
      }
    });

    return totalAmount.toFixed(2);
  };
  const toFindInvoice = (id) => {
    return Invoice.find((item) => item._id === id);
  };
  const handlePaymentHistory = (printOnly) => {
    navigate("/customer/customer-payment-print", {
      state: {
        data: {
          Invoice,
          Payment: payment,
          Customer: customer,
          printOnly: printOnly,
        },
      },
    });
  };
  return (
    <div className="mx-auto p-5">
      <Navbar
        logoText={"Medhouse Pharma - Inventory Management System"}
        brandText={"Customer Payment History"}
      />
      <div className="mt-5 flex w-full items-center justify-between gap-4 rounded-lg bg-white p-6 shadow-md">
        {/* Customer Details */}
        <div className="flex flex-wrap gap-4">
          <div>
            <span className="font-semibold text-gray-700">Name: </span>
            <span className="text-gray-800">{customer?.name || "N/A"}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Phone: </span>
            <span className="text-gray-800">{customer?.phone || "N/A"}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email: </span>
            <span className="text-gray-800">{customer?.email || "N/A"}</span>
          </div>
          {/* Address Details */}
          <div className="flex gap-2">
            <span className="font-semibold text-gray-700">Address: </span>
            <div className="text-gray-800">
              <span className="font-medium">{`${
                customer?.address?.street || ""
              }, ${customer?.address?.city || ""}, ${
                customer?.address?.state || ""
              }, ${customer?.address?.zip || ""}`}</span>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handlePaymentHistory("Both");
          }}
          className="rounded-lg bg-blue-500 py-2 px-4 font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Print
        </button>
      </div>

      <div className="overflow-x-auto">
        {Invoice.length > 0 ? (
          <table className="relative mt-10 min-w-full border border-gray-200 bg-white">
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePaymentHistory("Invoice");
              }}
              className="absolute top-0 right-0 rounded-lg bg-blue-500 py-2 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Print
            </button>
            <caption className="mb-2 text-left  text-2xl font-bold  text-gray-800 ">
              Transactions
            </caption>
            <thead className="">
              <tr className="rounded-md border-b bg-blue-500 ">
                <th className="px-4 py-2 text-left font-bold text-white">
                  Invoice Number
                </th>
                <th className="px-4 py-2 text-left font-bold text-white">
                  Amount
                </th>
                <th className="px-4 py-2 text-left font-bold text-white">
                  Payment
                </th>
                <th className="px-4 py-2 text-left font-bold text-white">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {Invoice.length &&
                Invoice.map((item, index) => (
                  <tr key={index} className="border-b ">
                    <td className="px-4 py-2">{item?.invoiceNumber}</td>
                    <td className="px-4 py-2">
                      {item?.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {/* {payment[index]?.amountPaid?.toFixed(2) || "0.00"} */}
                      {toFind(item?._id)}
                    </td>
                    <td className="px-4 py-2">
                      {item?.totalAmount - toFind(item?._id) || "0.00"}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              {Invoice.length > 0 && (
                <tr className="bg-gray-100 font-semibold text-gray-800">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2">
                    {Invoice.reduce(
                      (sum, item) => sum + item?.totalAmount,
                      0
                    ).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    {payment
                      .reduce((sum, pay) => sum + (pay?.amount || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    {(
                      Invoice.reduce(
                        (sum, item) => sum + item?.totalAmount,
                        0
                      ) -
                      payment.reduce((sum, pay) => sum + (pay?.amount || 0), 0)
                    ).toFixed(2)}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        ) :   <div className="w-full h-20 bg-gray-200 rounded-xl mt-10 flex justify-center items-center text-base font-semibold">There is no invoice record of Customer</div>}

        {payment && payment.length > 0 ? (
          <table className="relative mt-10 min-w-full border border-gray-200 bg-white text-left ">
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePaymentHistory("Payment");
              }}
              className="absolute top-0 right-0 rounded-lg bg-blue-500 py-2 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
            >
              Print
            </button>
            <caption className="mb-2 text-left  text-2xl font-bold  text-gray-800">
              Payment Details
            </caption>
            <thead className="border-b text-gray-500 ">
              <tr>
                <th className="w-1/6 p-2">Date</th>
                <th className="w-1/4 p-2">Invoice Number</th>
                <th className="w-1/4 p-2">Transaction Amount</th>
                <th className="w-1/6 p-2">Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {payment && payment.length > 0 ? (
                payment.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-2">
                      {item?.transactionDate.split("T")[0]}
                    </td>
                    <td className="p-2">
                      {/* {SelectedProduct?.invoiceNumber ||
                        reference.invoiceNumber} */}
                      {toFindInvoice(item?.invoiceId)?.invoiceNumber}
                    </td>
                    <td className="p-2">{item.amount}</td>
                    <td className="p-2">{item.mode}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    There are no transactions associated with this customer
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="w-full h-20 bg-gray-200 rounded-xl mt-10 flex justify-center items-center text-base font-semibold">There is no payment record of Customer</div>
        )}
      </div>
    </div>
  );
}

export default CustomerInvoicePayment;
