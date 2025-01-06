import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import { API_NEW_URL, X_API_Key } from "../config";

import { useReactToPrint } from "react-to-print";
import Logo from "../assets/img/medhouse.png";
import BG from "../assets/img/bg.png";

const AnyOther = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const location = useLocation();
  const { data } = location.state || {};
  const [ProductList, setProductList] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date());

  const getProducttoAdd = async () => {
    console.log("hit")
    const apiUrl = `${API_NEW_URL}product/list?name=&page=1&limit=`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': X_API_Key
        }
      });

      const data = await response.json();
      console.log(data)
      if (data.status === true) {
        setProductList(data.products)
      } else {
        alert("Something went wrong please try again")
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getProducttoAdd();
  }, []);

  const handlePrintFun = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handlePrintFun();
  };

  // Getting Product


  const FindSku = (id) => {
    console.log("id", ProductList)
    if (ProductList) {

      const foundItem = ProductList.find(item => item._id === id);

      return foundItem ? foundItem : 'SKU not found';
    }

  };

  // to change date formate
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  return (
    <>
      {data ? (
        <>
          <div
            style={{ backgroundImage: `url(${BG})` }}
            ref={componentRef} className="mx-auto p-10 min-h-screen max-w-4xl bg-white bg-center bg-repeat bg-16">
            <div>
              <button
                onClick={handlePrint}
                className="notPrint mb-5 border-transparent inline-flex items-center gap-x-2 rounded-lg border bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone" >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </p>
                  <p className="flex justify-end gap-4 text-base leading-5 text-gray-800">
                    www.medhousepharma.com{" "}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe" >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </p>
                  <p className="flex justify-end gap-4 text-base leading-5 text-gray-800">
                    info@medhousepharma.com{" "}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </p>
                </div>
              </div>
              <div className="mt-7 mb-5 grid grid-cols-2 bg-blue-500 p-2.5">
                <p className="leading-2 text-2xl font-bold text-white">
                  {data.ChallanName} ({data.InvoiceNumber})
                </p>
                <p className="min-w-[80px] dark:text-neutral-500 text-white text-right"><b>Invoice Date: {formatDate(data.InvoiceDate)}</b> </p>
              </div>
              <div>
                <div>
                  <p className="text-black text-lg font-bold">
                    {data.ReceiveFrom}
                  </p>
                </div>
                <div>

                  <div className="flex gap-10">
                    <div className="grid flex-1 text-sm sm:flex flex-col">
                      <label className="min-w-[80px] dark:text-neutral-500 text-gray-800">Billed to:</label>
                      <address className="not-italic font-normal">
                        {data.Billedto.companyName}{", "}
                        {data.Billedto.name}{", "}
                        {data.Billedto.email}{", "}
                        {data.Billedto.phone}{", "}
                        {data.Billedto.address.street}, {data.Billedto.address.city}, {data.Billedto.address.state}
                        {data.Billedto.address.zip}
                      </address>
                    </div>
                    <div className="grid flex-1 text-sm">
                      <label className="min-w-[80px] dark:text-neutral-500 text-gray-800 font-bold">From:</label>
                      <div>
                        <address className="not-italic font-normal">
                          MED HOUSE PHARMACEUTICAL LTD,
                          FOKAL HOUSE NO 3(FIRST FLOOR) OFFICIAL STREET.,
                          ADABRAKA, ACCRA GHANA, <br />
                          CONTACT NO: +233-504615240, +233-536504886
                        </address>
                      </div>
                      <label className="min-w-[80px] dark:text-neutral-500 text-gray-800 font-bold mt-5">Bank Details</label>
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
                          <p className="text-sm text-gray-800">MED HOUSE PHARMACEUTICAL LTD</p>
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

                  {/* <p className="text-black text-base">Price: {data.ReciptPrice}</p> */}
                </div>
                {data?.SelectedProduct || data?.AddedProduct ? <>
                  <div className="dark:border-neutral-700 mt-6 space-y-4 rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-10 border-t border-gray-200 pt-4 gap-2">
                      <div className="dark:text-neutral-500 text-[.65rem] font-medium uppercase text-gray-800 sm:col-span-2">
                        Name
                      </div>
                      <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium capitalize text-gray-800">
                        SKU
                      </div>
                      <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium capitalize text-gray-800">
                        Type
                      </div>
                      <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium capitalize text-gray-800">
                        Pack Style
                      </div>
                      <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium capitalize text-gray-800">
                        No Of Carton
                      </div>
                      <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium capitalize text-gray-800">
                        Total Unit Quantity
                      </div>
                      <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium capitalize text-gray-800">
                        Unit Price
                      </div>
                      <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium capitalize text-gray-800">
                        Discount
                      </div>
                      <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium capitalize text-gray-800">
                        Total Value Gh
                      </div>
                    </div>
                    {data.AddedProduct ? <>
                      {data.AddedProduct.map((item, index) => (
                        <div className="grid grid-cols-10 border-t border-gray-200 pt-4 gap-2">
                          <div className="dark:text-neutral-500 text-[.65rem] font-medium uppercase text-gray-800 sm:col-span-2">
                            {ProductList ?
                              <>
                                {item.product ?
                                  FindSku(item.product).name
                                  : <></>}
                              </>
                              : null}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.sku}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.type}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.packingStyle}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.noOfCarton}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.totalUnitQuantity}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.unitPrice}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.discount}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.totalUnitQuantity && item.unitPrice ? parseFloat(item.totalUnitQuantity) * parseFloat(item.unitPrice) : <></>}
                          </div>
                        </div>
                      ))}
                    </> : <></>}
                    {
                      console.log(data)  }
                    {data.SelectedProduct ? <>
                      {data.SelectedProduct.map((item, index) => (
                        <div className="grid grid-cols-10  border-t border-gray-200 pt-4 gap-2">
                          <div className="dark:text-neutral-500 text-[.65rem] font-medium uppercase text-gray-800 sm:col-span-2">
                            {item.name}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.sku}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.type}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.packingStyle}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">

                            {item.noOfCarton}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">

                            {item.totalUnitQuantity}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.discount}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.unitPrice}
                          </div>
                          <div className="dark:text-neutral-500 text-start text-[.65rem] font-medium uppercase text-gray-800">
                            {item.totalUnitQuantity && item.unitPrice ? parseFloat(item.totalUnitQuantity) * parseFloat(item.unitPrice) : <></>}
                          </div>
                        </div>
                      ))}
                    </> : <></>}
                  </div>
                  <div className="flex justify-end">
                    <table className="mt-5">
                      <tbody>
                        {data?.TotalGroshValue ?
                          <tr className="flex justify-between min-w-[250px]">
                            <td>Total Gross Value</td>
                            <td className="pl-4">{data.TotalGroshValue}</td>
                          </tr>
                          : null}
                        {data?.Discount ?
                          <tr className="flex  justify-between min-w-[250px]">
                            <td>Discount</td>
                            <td className="pl-4">{data.Discount}%</td>
                          </tr>
                          : null}
                        {data?.Tax ?
                          <tr className="flex justify-between min-w-[250px]">
                            <td>Tax</td>
                            <td className="pl-4">{data.Tax}%</td>
                          </tr>
                          : null}
                        {data?.TotalPrice ?
                          <tr className="flex justify-between min-w-[250px]">
                            <td>Total Price</td>
                            <td className="pl-4">{data.TotalPrice}</td>
                          </tr>
                          : null}
                        {data?.totalAddedAmount ?
                          <>
                            <tr className="flex justify-between min-w-[250px] mt-5 text-green-500">
                              <td>Paid</td>
                              <td className="pl-4">{data.totalAddedAmount}</td>
                            </tr>
                            {data?.totalAddedAmount && data?.TotalPrice ?
                              <tr className="flex justify-between min-w-[250px] font-bold">
                                <td>Remaining Amount:</td>
                                <td className="pl-4">{data.TotalPrice - data.totalAddedAmount}</td>
                              </tr>
                              : null}
                          </>
                          : null}
                      </tbody>
                    </table>
                  </div>
                </> : <></>}
              </div>
              <div className="grid grid-cols-4 mt-10">
                <div className="col-span-2 border border-gray-200 p-2 bg-white min-h-64 flex flex-col justify-between items-center">
                  <p className="text-base text-gray-800">MED HOUSE PHARMACEUTICAL LTD</p>
                  <p className="text-base text-gray-800 mt-10">Authorized Signatory</p>
                </div>
                <div className="col-span-1 border border-gray-200 p-2 bg-white min-h-64 flex flex-col justify-between items-center">
                  <p className="text-base text-gray-800">Customer's Signature</p>
                </div>
                <div className="col-span-1 border border-gray-200 p-2 bg-white min-h-14 flex flex-col justify-between items-center">
                  <p className="text-base text-gray-800">Salesman Signature</p>
                </div>
              </div>
              <div className="mt-24">
                <p className="text-right italic text-sm">Printed on : {currentDate.toLocaleString('en-GB', { timeZone: 'Africa/Accra' })}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default AnyOther;
