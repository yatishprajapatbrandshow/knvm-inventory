import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Logo from "../assets/img/medhouse.png";
import BG from "../assets/img/bg.png";

const StockPrintDetails = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const location = useLocation();
  const { data } = location.state || {}; // Fetching the data passed from the previous component

  const [Customer, setCustomer] = useState(data.Customer || {});
  const [Invoice, setInvoice] = useState([]);
  const [Payment, setPayment] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [printOnly, setPrintOnly] = useState(data.printOnly || "Both");
  const [productName, setProductName] = useState(data.productName || "N/A");

  // New data being passed
  const [totalQuantityIn, setTotalQuantityIn] = useState(data.totalQuantityIn || 0);
  const [totalQuantityOut, setTotalQuantityOut] = useState(data.totalQuantityOut || 0);
  const [receiptNumber, setReceiptNumber] = useState(data.receiptNumber || "N/A");

  useEffect(() => {
    if (data) {
      setInvoice(data.Invoice || []);
      setPayment(data.Payment || []);
      setCustomer(data.Customer || {});
      setPrintOnly(data.printOnly || "Both");
      setStockData(data.stockData || []);
      setProductName(data.productName || "N/A");
      
      // Calculate Total Quantity In and Out if not directly available
      const quantityInSum = data.stockData?.reduce((sum, item) => sum + (item.quantityIn || 0), 0);
      const quantityOutSum = data.stockData?.reduce((sum, item) => sum + (item.quantityOut || 0), 0);

      setTotalQuantityIn(quantityInSum || 0);
      setTotalQuantityOut(quantityOutSum || 0);
      
      setReceiptNumber(data.receiptNumber || "N/A");
    }
  }, [data]);

  const handlePrintFun = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handlePrintFun();
  };

  // Function to format date or return 'Invalid Date' if the date is invalid
  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <>
      {data ? (
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

          {/* Stock Data Table */}
          <div className="mt-7 mb-5 grid grid-cols-2 ">
            <p className="leading-2 text-2xl font-bold text-gray-800">Stock Details</p>
            <p className="dark:text-neutral-500 min-w-[80px] text-right text-gray-800">
              <b>Date: {formatDate(new Date())}</b>
            </p>
          </div>

          {stockData.length > 0 && (
            <>
              {/* Product Information (Name and SKU) */}
              <div>
                <p className="text-lg font-bold text-gray-800 mb-2">
                  <span className="font-medium">Product Name:</span> {productName || "N/A"}
                </p>
                <p className="text-lg font-bold text-gray-800 mb-2">
                  <span className="font-medium">SKU:</span> {stockData[0]?.sku || "N/A"}
                </p>
              </div>

              {/* Stock Transaction Table */}
              <table className="mt-5 min-w-full border border-gray-200 bg-white text-left shadow-md rounded-lg">
  <thead className="bg-blue-500 text-white">
    <tr>
      <th className="px-4 py-2 text-left font-bold text-white">Date</th>
      <th className="px-4 py-2 text-left font-bold text-white">Batch</th>
      <th className="px-4 py-2 text-left font-bold text-white">Quantity In</th>
      <th className="px-4 py-2 text-left font-bold text-white">Receipt Number</th>
      <th className="px-4 py-2 text-left font-bold text-white">Quantity Out</th>
      <th className="px-4 py-2 text-left font-bold text-white">Invoice Number</th>
      <th className="px-4 py-2 text-left font-bold text-white">Running Balance</th>
    </tr>
  </thead>
  <tbody>
    {stockData.map((item) => (
      <tr key={item._id} className="border-t border-gray-200">
        <td className="px-4 py-2">{new Date(item.createdAt).toLocaleDateString()}</td> {/* Only Date */}
        <td className="px-4 py-2">{item.batch}</td>
        <td className="px-4 py-2">{item.receipt ? item.quantity : "0"}</td>
        <td className="px-4 py-2">{item.receiptNumber || "0"}</td>
        <td className="px-4 py-2">{item.receipt ? "0" : item.quantity}</td>
        <td className="px-4 py-2">{item.invoiceNumber}</td>
        <td className="px-4 py-2">{item.runningBalance || "0"}</td>
      </tr>
    ))}
  </tbody>
</table>

            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default StockPrintDetails;
