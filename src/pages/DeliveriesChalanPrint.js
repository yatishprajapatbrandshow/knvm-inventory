import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import {API_NEW_URL, X_API_Key} from "../config";

import { useReactToPrint } from "react-to-print";
import Logo from "../assets/img/medhouse.png";
import BG from "../assets/img/bg.png";

const AnyOther = () => {
  const navigate = useNavigate();
  const componentRef = useRef();
  const location = useLocation();
  const { data } = location.state || {};
  const [ProductList, setProductList] =useState("")
  const [currentDate, setCurrentDate] = useState(new Date());
  console.log(ProductList);
  const handlePrintFun = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    handlePrintFun();
  };


  const getProducttoAdd = async () => {
    const apiUrl = `${API_NEW_URL}product/list?name=&page=1&limit='`
    
    try { 
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers:{
          'Content-Type' : 'application/json',
          'X-API-Key': X_API_Key
        }
      });
      
      const data = await response.json();
      console.log("product", data);
      if(data.status === true){
        setProductList(data.products)
      }else{
        alert("Something went wrong please try again")
      }
    }catch (error) {
      console.log(error);
    }
  }

  
  useEffect(() => {
    getProducttoAdd();
  }, []);


  const FindSku = (id) => {
    const foundItem = ProductList.find(item => item._id === id);
    return foundItem ? foundItem : 'SKU not found';
    
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
              <div className="mt-7 mb-5 grid grid-cols-1">
                <p className="leading-2 bg-blue-500 p-2.5 text-2xl font-bold text-white">
                  {data.ChallanName} ({data.SourceDocument})
                </p>
              </div>
              <div>
                <div>
                  <p className="text-black text-lg font-bold">
                    {data.ReceiveFrom}
                  </p>
                </div>
                <div>
                  <p className="text-black text-base">
                  Deliver to: {data.CompanyName}
                  </p>
                  {/* <p className="text-black text-base">Price: {data.ReciptPrice}</p> */}
                </div>
                {data.vendors ? (
                  <>
                    {data.vendors.map((item, index) => (
                      <div className="mt-5 border-t border-t-gray-900 pt-5">
                        <p className="text-black text-base font-bold">
                          {item.product && ProductList ?<>
                                {FindSku(item.product).name}
                          </>: <></>}
                        </p>
                        <p className="text-black text-base">
                          SKU: {item.SKU}
                        </p>
                        <div className="mt-2 grid grid-cols-2">
                          <div>
                            <p className="text-black text-sm">
                              <b>Quantity:</b> {item.quantity}
                            </p>
                            <p className="text-black text-sm">
                              <b>Unit:</b> {item.unit}
                            </p>
                            <p className="text-black text-sm">
                              <b>Delivery Date:</b> {formatDate(item.ReceiptDate)}
                            </p>
                            <p className="text-black text-sm">
                              <b>Manufacturing Date:</b> {formatDate(item.manufacturing)}
                            </p>
                            <p className="text-black text-sm">
                              <b>Expiry Date:</b> {formatDate(item.expiry)}
                            </p>
                            <p className="text-black text-sm">
                              <b>Batch Number:</b> {item.batch}
                            </p>
                            <p className="text-black text-sm">
                              <b>Price:</b> {item.price}
                            </p>
                          </div>
                          <div>
                            <p className="text-black text-sm">
                              <b>Package Quantity:</b> {item.packingNo}
                            </p>
                            <p className="text-black text-sm">
                              <b>Package Type:</b> {item.packingType}
                            </p>
                            <p className="text-black text-sm">
                              <b>Total Price:</b> {item.TotalPrice}
                            </p>
                            <p className="text-black text-sm">
                              <b>Box Identification:</b> {item.BoxID}
                            </p>
                            <p className="text-black text-sm">
                              <b>Reference Number:</b> {item.RefrenceNumber}
                            </p>
                            <p className="text-black text-sm">
                              <b>Remark:</b> {item.Remark}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
              <div className="mt-16">
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
