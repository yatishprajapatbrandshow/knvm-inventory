import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Logo from "../assets/img/medhouse.png";
import BG from "../assets/img/bg.png";

const CustomerPrintPayment = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const location = useLocation();
  const { data } = location.state || {}; // Fetching the data passed from the previous component
  const [Customer, setCustomer] = useState(data.Customer || {}); // State for storing the customer data
  const [Invoice, setInvoice] = useState([]); // State for storing the Invoice data
  const [Payment, setPayment] = useState([]); // State for storing the Payment data
  const [printOnly, setPrintOnly] = useState(data.printOnly || "Both"); // State for checking if the print button is clicked

  // If data is passed from location, set the Invoice and Payment state
  useEffect(() => {
    if (data) {
      setInvoice(data.Invoice || []);
      setPayment(data.Payment || []);
      setCustomer(data.Customer || {});
      setPrintOnly(data.printOnly || "Both");
    }
  }, [data]);

  const handlePrintFun = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handlePrintFun();
  };

  // Formatting the date to readable format
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  const toFind = (id) => {
    let totalAmount = 0;

    Payment.forEach((item) => {
      if (item.invoiceId === id) {
        totalAmount += item.amount;
      }
    });

    return totalAmount.toFixed(2);
  };
  const toFindInvoice = (id) => {
    return Invoice.find((item) => item._id === id);
  };
  return (
    <>
      {data ? (
        <>
          <div
            style={{ backgroundImage: `url(${BG})` }}
            ref={componentRef}
            className="mx-auto min-h-screen max-w-4xl bg-white bg-16 bg-center bg-repeat p-10"
          >
            <button
              onClick={handlePrint}
              className="notPrint border-transparent mb-5 inline-flex items-center gap-x-2 rounded-lg border bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
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

            <div className="grid grid-cols-2">
              <img src={Logo} width={250} alt="Logo" />
              <div className="flex flex-col items-end justify-end">
                <p className="flex justify-end gap-4 text-base leading-5 text-gray-800">
                  +233-504615240{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </p>
                <p className="flex justify-end gap-4 text-base leading-5 text-gray-800">
                  www.medhousepharma.com{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                </p>
                <p className="flex justify-end gap-4 text-base leading-5 text-gray-800">
                  info@medhousepharma.com{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </p>
              </div>
            </div>
            <div className="mt-7 mb-5 grid grid-cols-2 bg-blue-500 p-2.5">
              <p className="leading-2 text-2xl font-bold text-white">
                Cutomer Payment Details
              </p>
              <p className="dark:text-neutral-500 min-w-[80px] text-right text-white">
                <b>Date: {formatDate(new Date())}</b>{" "}
              </p>
            </div>
            <div className="flex gap-10">
              <div className="grid flex-1 flex-col text-sm sm:flex">
                <label className="dark:text-neutral-500 min-w-[80px] text-gray-800">
                  Billed to:
                </label>
                <address className="font-normal not-italic">
                  {Customer?.companyName}
                  {", "}
                  {Customer?.name}
                  {", "}
                  {Customer?.email}
                  {", "}
                  {Customer?.phone}
                  {", "}
                  {Customer?.address?.street}, {Customer?.address?.city},{" "}
                  {Customer?.address?.state}
                  {Customer?.address?.zip}
                </address>
              </div>
              <div className="grid flex-1 text-sm">
                <label className="dark:text-neutral-500 min-w-[80px] font-bold text-gray-800">
                  From:
                </label>
                <div>
                  <address className="font-normal not-italic">
                    MED HOUSE PHARMACEUTICAL LTD, FOKAL HOUSE NO 3(FIRST FLOOR)
                    OFFICIAL STREET., ADABRAKA, ACCRA GHANA, <br />
                    CONTACT NO: +233-504615240, +233-536504886
                  </address>
                </div>
                <label className="dark:text-neutral-500 mt-5 min-w-[80px] font-bold text-gray-800">
                  Bank Details
                </label>
                <div>
                  <dl className="grid gap-x-3 text-sm sm:flex">
                    <p className="dark:text-neutral-500 min-w-[120px] text-gray-700">
                      {" "}
                      Account Name:{" "}
                    </p>
                    <p className="text-sm text-gray-800">
                      {" "}
                      MED HOUSE PHARMACEUTICAL LTD{" "}
                    </p>
                  </dl>
                  <dl className="grid gap-x-3 text-sm sm:flex">
                    <p className="dark:text-neutral-500 min-w-[120px] text-gray-700">
                      {" "}
                      Bank Name:{" "}
                    </p>
                    <p className="text-sm text-gray-800">
                      ZENITH BANK (GHANA) LIMITED{" "}
                    </p>
                  </dl>
                  <dl className="grid gap-x-3 text-sm sm:flex">
                    <p className="dark:text-neutral-500 min-w-[120px] text-gray-700">
                      {" "}
                      Branch Name:{" "}
                    </p>
                    <p className="text-sm text-gray-800"> HEAD OFFICE</p>
                  </dl>
                  <dl className="grid gap-x-3 text-sm sm:flex">
                    <p className="dark:text-neutral-500 min-w-[120px] text-gray-700">
                      {" "}
                      Bank Address:{" "}
                    </p>
                    <p className="text-sm text-gray-800">
                      {" "}
                      ZENITH HEIGHTS, NO. 37 INDEPENDENCE AVENUE, ACCRA, GHANA{" "}
                    </p>
                  </dl>
                  <dl className="grid gap-x-3 text-sm sm:flex">
                    <p className="dark:text-neutral-500 min-w-[120px] text-gray-700">
                      {" "}
                      A/C No:{" "}
                    </p>
                    <p className="text-sm text-gray-800">6110106240</p>
                  </dl>
                  <dl className="grid gap-x-3 text-sm sm:flex">
                    <p className="dark:text-neutral-500 min-w-[120px] text-gray-700">
                      {" "}
                      Merchant Name:{" "}
                    </p>
                    <p className="text-sm text-gray-800">
                      MED HOUSE PHARMACEUTICAL LTD
                    </p>
                  </dl>
                  <dl className="grid gap-x-3 text-sm sm:flex">
                    <p className="dark:text-neutral-500 min-w-[120px] text-gray-700">
                      {" "}
                      Mtn Momo Number:{" "}
                    </p>
                    <p className="text-sm text-gray-800">0530446851</p>
                  </dl>
                  <dl className="grid gap-x-3 text-sm sm:flex">
                    <p className="dark:text-neutral-500 min-w-[120px] text-gray-700">
                      {" "}
                      Mtn Momo Id:{" "}
                    </p>
                    <p className="text-sm text-gray-800">418267</p>
                  </dl>
                </div>
              </div>
            </div>
            {/* Invoice Table */}
            {(Invoice.length > 0 && printOnly === "Both") ||
            printOnly === "Invoice" ? (
              <table
                className={`mt-10 min-w-full border border-gray-200 bg-white ${
                  printOnly !== "Both" && printOnly !== "Invoice"
                    ? "notPrint"
                    : ""
                }`}
              >
                <caption className="mb-2 text-left  text-2xl font-bold  text-gray-800">
                  Transactions
                </caption>
                <thead className="">
                  <tr className="rounded-md border-b bg-blue-500 text-white">
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
                        <td className="px-4 py-2">{toFind(item?._id)}</td>
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
                        {Payment.reduce(
                          (sum, pay) => sum + (pay?.amount || 0),
                          0
                        ).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        {(
                          Invoice.reduce(
                            (sum, item) => sum + item?.totalAmount,
                            0
                          ) -
                          Payment.reduce(
                            (sum, pay) => sum + (pay?.amount || 0),
                            0
                          )
                        ).toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            ) : null}

            {/* Payment Table */}
            {(Payment && printOnly === "Both") || printOnly === "Payment" ? (
              <table
                className={`mt-5 min-w-full border border-gray-200 bg-white text-left ${
                  printOnly !== "Both" && printOnly !== "Payment"
                    ? "notPrint"
                    : ""
                }`}
              >
                <caption className="mb-2 text-left  text-2xl font-bold  text-gray-800">
                  Payment Details
                </caption>
                <thead className="border-b  bg-blue-500 text-white  ">
                  <tr>
                    <th className="w-1/6 p-2">Date</th>
                    <th className="w-1/4 p-2">Invoice Number</th>
                    <th className="w-1/4 p-2">Transaction Amount</th>
                    <th className="w-1/6 p-2">Payment Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {Payment && Payment.length > 0 ? (
                    Payment.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="p-2">
                          {item?.transactionDate.split("T")[0]}
                        </td>
                        <td className="p-2">
                          {toFindInvoice(item?.invoiceId)?.invoiceNumber}
                        </td>
                        <td className="p-2">{item.amount}</td>
                        <td className="p-2">{item.mode}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 text-center text-gray-500"
                      >
                        There are no transactions associated with this customer
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : null}
            <div className="flex justify-end">
              <table className="mt-5">
                <tbody>
                  {Invoice ? (
                    <tr className="flex min-w-[250px] justify-between">
                      <td>Total Price</td>
                      <td className="pl-4">
                        {Invoice.reduce(
                          (sum, item) => sum + item?.totalAmount,
                          0
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ) : null}
                  {Invoice ? (
                    <>
                      <tr className="mt-2 flex min-w-[250px] justify-between text-green-500">
                        <td>Paid</td>
                        <td className="pl-4">
                          {" "}
                          {Payment.reduce(
                            (sum, pay) => sum + (pay?.amount || 0),
                            0
                          ).toFixed(2)}
                        </td>
                      </tr>
                      {Invoice ? (
                        <tr className="mt-2 flex min-w-[250px] justify-between font-bold text-red-500">

                          <td>Remaining Amount:</td>
                          <td className="pl-4">
                            {(
                              Invoice.reduce(
                                (sum, item) => sum + item?.totalAmount,
                                0
                              ) -
                              Payment.reduce(
                                (sum, pay) => sum + (pay?.amount || 0),
                                0
                              )
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ) : null}
                    </>
                  ) : null}
                </tbody>
              </table>
            </div>
            <div className="mt-24">
              <p className="text-right text-sm italic">
                Printed on :{" "}
                {new Date().toLocaleString("en-GB", {
                  timeZone: "Africa/Accra",
                })}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p>No data available to display.</p>
      )}
    </>
  );
};

export default CustomerPrintPayment;
