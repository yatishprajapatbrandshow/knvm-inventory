import Navbar from "pages/Navbar";
import { useEffect, useState, useRef } from "react";
import { API_NEW_URL, X_API_Key } from "../config";
import { isSessionActive } from "utils/sessionUtils";
import { useNavigate, useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import {
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import LogNote from "./LogNote";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useReactToPrint } from "react-to-print";

const AddCategory = [
  { name: "Operations" },
  { name: "Additional Info" },
  { name: "Note" },
];

const AnyOther = () => {
  const Session = isSessionActive();
  const navigate = useNavigate();
  const location = useLocation();
  const { reference } = location.state || {};
  const componentRef = useRef();

  useEffect(() => {
    if (!Session) navigate("/login");
  }, []);

  const [Reference, setReference] = useState("");
  const [ReceiveFrom, setReceiveFrom] = useState("");
  const [SourceDocument, setSourceDocument] = useState("");
  const [CompanyName, setCompanyName] = useState("");
  const [MobNumber, setMobNumber] = useState("");
  const [Email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [canAddProduct, setcanAddProduct] = useState(false);
  const [AddProductSign, setAddProductSign] = useState(false);
  const [ProductList, setProductList] = useState("");
  const [Receipt, setReceipt] = useState("");
  const [Save, setLoad] = useState([]);
  const [ReceiptCreated, setReceiptCreated] = useState(false);
  const [ReciptPrice, setReciptPrice] = useState("");
  const [ReciptDate, setReciptDate] = useState("");
  const [Responsible, setResponsible] = useState("");
  const [ProductMapError, setProductMapError] = useState("");
  const [CanEditDeliveries, setCanEditDeliveries] = useState(false);

  const [value, onChangeDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());

  const [UserList, setUserList] = useState("");
  const [SelectedUser, setSelectedUser] = useState("");

  const FormateDate = (value) => {
    const dateObject = new Date(value);
    let formattedDate =
      String(dateObject.getDate()).padStart(2, "0") +
      "-" +
      String(dateObject.getMonth() + 1).padStart(2, "0") +
      "-" +
      dateObject.getFullYear();
 
    return formattedDate;
  };

  const [ErrorMessage, setErrorMessage] = useState(false);

  const [vendors, setVendors] = useState([]);
  const handleVendorChange = (index, field, value) => {
    const newVendors = [...vendors];
    newVendors[index][field] = value;
    setVendors(newVendors);
  };

  const addVendor = () => {
    setVendors([
      ...vendors,
      {
        product: "",
        SKU: "",
        quantity: "",
        unit: "",
        manufacturing: new Date(),
        batch: "",
        price: "",
        expiry: new Date(),
        packingNo: "",
        packingType: "",
        TotalPrice: "",
        ReceiptDate: new Date(),
        BoxID: "",
        RefrenceNumber: "",
        Remark: "",
      },
    ]);
  };

  const deleteVendor = (index) => {
    ProductMap(index, "delete");
    const newVendors = [...vendors];
    newVendors.splice(index, 1);
    setVendors(newVendors);
  };

  useEffect(() => {
    if (reference) {
      console.log(reference);
      setReceiveFrom(reference.contact);
      setSourceDocument(reference.sourceDocument);
      setCompanyName(reference.companyDetails?.companyName);
      setReference(reference.reference);
      onChangeDate(new Date(reference.scheduledDate));
      getProductMapedwithRecipt(reference._id);
      setReceipt(reference);
      setReciptPrice(reference.price);
      setcanAddProduct(true);
      setReceiptCreated(true);
      setSelectedUser(
        reference?.additionalInformation?.otherInformation?.responsible
      );
      getProducttoAdd();
      setCanEditDeliveries(true);
    }
  }, [reference]);

  // const getProductMapedwithRecipt = async (receiptId) => {
  //   console.log("8908018704885");
  //   const apiUrl = `${API_NEW_URL}delivery-product-map/get?deliveryId=${receiptId}&page=1&limit=`;

  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-API-Key": X_API_Key,
  //       },
  //     });

  //     const data = await response.json();
  //     if (data.status === true) {
  //       if (data.Delivery) {
  //         console.log(data);

  //         const newVendors = data.Delivery.filter(
  //           (item) => !vendors.some((vendor) => vendor.product === item.product)
  //         ).map((item) => ({
  //           product: item.product,
  //           quantity: item.quantity,
  //           unit: item.unit,
  //           manufacturing: new Date(item?.manufacturing),
  //           batch: item.batch,
  //           price: item.price,
  //           expiry: new Date(item?.expiry),
  //           packingNo: item.packNumber,
  //           packingType: item.packType,
  //           TotalPrice: item.totalPrice,
  //           ReceiptDate: new Date(item?.deliveryDate),
  //           SKU: item.sku,
  //           BoxID: item.boxId,
  //           RefrenceNumber: item.referenceNo,
  //           Remark: item.remark,
  //         }));
  //         setVendors((prevVendors) => [...prevVendors, ...newVendors]);

  //         setLoad((prevSave) => [...prevSave, ...newVendors]);
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const getProductMapedwithRecipt = async (receiptId) => {
    console.log("8908018704885");
    const apiUrl = `${API_NEW_URL}delivery-product-map/get?deliveryId=${receiptId}&page=1&limit=`;

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
        if (data.Delivery) {
          console.log(data);

          const newVendors = data.Delivery.filter(
            (item) => !vendors.some((vendor) => vendor.product === item.product)
          ).map((item) => ({
            product: item.product,
            quantity: item.quantity,
            unit: item.unit,
            manufacturing: item.manufacturing
              ? new Date(item.manufacturing)
              : new Date(),
            batch: item.batch,
            price: item.price,
            expiry: item.expiry ? new Date(item.expiry) : new Date(),
            packingNo: item.packNumber,
            packingType: item.packType,
            TotalPrice: item.totalPrice,
            ReceiptDate: item.deliveryDate
              ? new Date(item.deliveryDate)
              : new Date(),
            SKU: item.sku,
            BoxID: item.boxId,
            RefrenceNumber: item.referenceNo,
            Remark: item.remark,
          }));
          setVendors((prevVendors) => [...prevVendors, ...newVendors]);

          setLoad((prevSave) => [...prevSave, ...newVendors]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const apiUrl = `${API_NEW_URL}user/get?name=&page=1&limit=50'`;
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
          setUserList(data.userList);
        } else {
          alert("Something went wrong please try again");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [reference]);

  const CreateDeliveries = async () => {
    setErrorMessage("");

    let errorBox = [];
    console.log("datas");
    if (!ReceiveFrom) {
      errorBox.push("Receive From fie is required.");
    }
    if (!value) {
      errorBox.push("Scheduled date is required.");
    }
    if (!SourceDocument) {
      errorBox.push("Source document is required.");
    }
    if (!CompanyName) {
      errorBox.push("Company name is required.");
    }
    if (!ReciptPrice) {
      errorBox.push("Please Add Recipt Price.");
    }
    if (!SelectedUser) {
      errorBox.push("Please Add Responsible person name.");
    }

    if (errorBox.length > 0) {
      setErrorMessage(errorBox);
      console.log(errorBox);
      return;
    }

    const date = new Date(value);
    date.setUTCHours(12, 0, 0, 0);
    const formattedDateStr = date.toISOString();

    // const datas = {
    //   contact: ReceiveFrom,
    //   scheduledDate: formattedDate,
    //   sourceDocument: SourceDocument,
    //   companyDetails:{
    //     companyName : CompanyName
    //   },
    //   additionalInformation: {
    //     otherInformation:{
    //       responsible: SelectedUser
    //     }
    //   }
    // };

    const datas = {
      contact: ReceiveFrom,
      scheduledDate: formattedDateStr,
      sourceDocument: SourceDocument,
      companyDetails: {
        companyName: CompanyName,
      },
      additionalInformation: {
        otherInformation: {
          responsible: SelectedUser,
        },
      },
      price: ReciptPrice,
    };

    const apiUrl = `${API_NEW_URL}delivery/add`;
    try {
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
        alert(data.message);
        setcanAddProduct(true);
        setReceiptCreated(true);
        setAddProductSign(true);
        setReceipt(data.delivery);
        getProducttoAdd();
      } else {
        setcanAddProduct(false);
      }
    } catch (error) {
      setcanAddProduct(false);
    }
  };

  const getProducttoAdd = async () => {
    console.log("Entered");

    const apiUrl = `${API_NEW_URL}product/list?name=&page=1&limit=100`;
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
        console.log(data);
        setProductList(data.products);
      } else {
        alert("Something went wrong please try again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ProductMap = async (index, purpose) => {
    const vendor = vendors[index];

    // Define a function to validate the data
    const validateData = () => {
      if (!vendor.SKU) return "SKU is required.";
      if (!vendor.product) return "Product name check is required.";
      if (!Receipt._id) return "Receipt ID is required.";
      if (isNaN(parseInt(vendor.quantity))) return "Quantity is required.";
      if (!vendor.unit) return "Unit is required.";
      if (!vendor.ReceiptDate || isNaN(new Date(vendor.ReceiptDate).getTime()))
        return "Valid receipt date is required.";
      if (
        !vendor.manufacturing ||
        isNaN(new Date(vendor.manufacturing).getTime())
      )
        return "Valid manufacturing date is required.";
      if (!vendor.batch) return "Batch is required.";
      if (isNaN(parseFloat(vendor.price))) return "Price must be a number.";
      if (!vendor.expiry || isNaN(new Date(vendor.expiry).getTime()))
        return "Valid expiry date is required.";
      if (isNaN(parseInt(vendor.packingNo)))
        return "Packing quantity is required.";
      if (!vendor.packingType) return "Packing type is required.";
      if (isNaN(parseFloat(vendor.TotalPrice)))
        return "Total price check is required.";
      if (!vendor.BoxID) return "Box ID is required.";
      if (!vendor.RefrenceNumber) return "Reference number is required.";
      if (!vendor.Remark) return "Remark is required.";
      return null;
    };

    // Validate the vendor data
    const validationError = validateData();
    if (validationError) {
      alert(validationError);
      return;
    }

    const datas = {
      product_id: vendor.product,
      delivery_id: Receipt._id,
      quantity: parseInt(vendor.quantity),
      unit: vendor.unit,
      status: purpose === "save" ? "true" : "false",
      manufacturing: vendor?.manufacturing.toISOString(),
      batch: vendor.batch,
      price: vendor.price,
      expiry: vendor?.expiry.toISOString(),
      totalPrice: vendor.TotalPrice,
      sku: vendor.SKU,
      packNumber: parseInt(vendor.packingNo),
      packType: vendor.packingType,
      deliveryDate: vendor?.ReceiptDate.toISOString(),
      boxId: vendor.BoxID,
      referenceNo: vendor.RefrenceNumber,
      remark: vendor.Remark,
    };

    const apiUrl = `${API_NEW_URL}delivery-product-map/addedit`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      if (data.success === true) {
        setLoad((prevSave) => [...prevSave, datas.product_id]);
        alert(data.message);
      } else {
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const CheckAddedorNot = (id) => {
    return Save.some((item) => item === id);
  };

  const EditDeliveries = async () => {
    const date = new Date(value);
    date.setUTCHours(12, 0, 0, 0);
    const formattedDateStr = date.toISOString();

    const datas = {
      contact: ReceiveFrom,
      scheduledDate: formattedDateStr,
      sourceDocument: SourceDocument,
      companyDetails: {
        companyName: CompanyName,
      },
      additionalInformation: {
        otherInformation: {
          responsible: SelectedUser,
        },
      },
      price: parseFloat(ReciptPrice),
    };

    if (
      datas.contact === "" ||
      datas.scheduledDate === "" ||
      datas.sourceDocument === "" ||
      datas.companyDetails.companyName === ""
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const apiUrl = `${API_NEW_URL}delivery/edit/${reference._id}`;
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": X_API_Key,
        },
        body: JSON.stringify(datas),
      });

      const data = await response.json();
      console.log(data);
      if (data.status === true) {
        alert(data.message);
        setReceiptCreated(true);
        setcanAddProduct(true);
      }
    } catch (error) {
      setcanAddProduct(false);
    }
  };

  const FindSku = (id) => {
    const foundItem = ProductList.find((item) => item.sku === id);
    return foundItem ? foundItem : "SKU not found";
  };

  const handlePrintFun = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePrint = () => {
    // handlePrintFun()
    const DataToSend = {
      ChallanName: "Delivery Challan",
      ReceiveFrom: ReceiveFrom,
      SourceDocument: SourceDocument,
      CompanyName: CompanyName,
      SelectedUser: SelectedUser,
      ReciptPrice: ReciptPrice,
      value: value,
      vendors: vendors,
    };
    // let allFieldsFilled = true;

    // for (const key in DataToSend) {
    //     if (!DataToSend[key]) {
    //         allFieldsFilled = false;
    //         break;
    //     }
    // }
    // if (!allFieldsFilled) {
    //     alert("Please check all fields are filled");
    // }
    navigate("/deliverieschalan", { state: { data: DataToSend } });
  };

  return (
    <>
      <div className="mx-auto p-5">
        <Navbar
          logoText={"Medhouse Pharma - Inventory Management System"}
          brandText={"deliveries"}
          // secondary={getActiveNavbar(routes)}
          // {...rest}
        />
        <div ref={componentRef} className="grid gap-5">
          <div className="bg-white p-5">
            {canAddProduct ? (
              <div className="notPrint flex justify-end border-b border-b-gray-200 pb-2">
                {CanEditDeliveries ? (
                  <button
                    onClick={() => setReceiptCreated(false)}
                    className="border-transparent inline-flex items-center gap-x-2 rounded-lg border bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-pencil"
                    >
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                    Edit
                  </button>
                ) : (
                  <></>
                )}
                <button
                  onClick={handlePrint}
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
            ) : null}
            {ErrorMessage ? (
              <>
                <div className="gap flex flex-col rounded-lg border border-red-200 bg-red-100 p-4">
                  {ErrorMessage.map((item, index) => (
                    <p
                      key={index}
                      className="text-left font-dm text-sm font-medium text-red-500"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </>
            ) : null}
            <div>
              <div className="mt-4 ">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    {ReceiptCreated ? (
                      <>
                        <div className="max-w-md">
                          <div className="rounded-xl border-[1px] border-dotted border-gray-700 p-2.5">
                            <p className="dark:text-neutral-200 px-3 text-lg font-semibold text-gray-800">
                              {ReceiveFrom}
                            </p>
                            <p className="dark:text-neutral-500 px-3 text-sm text-gray-700">
                              {Receipt.reference}
                            </p>
                            <div className="mt-4 grid grid-cols-2 px-3 ">
                              <p className="text-left text-sm uppercase text-gray-700">
                                Scheduled Date:
                                <span className="block font-bold text-gray-900">
                                  {FormateDate(value)}
                                </span>
                              </p>
                              <p className="text-left text-sm uppercase text-gray-700">
                                Source Document:
                                <span className="block font-bold text-gray-900">
                                  {SourceDocument}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="overflow-hidden rounded-xl border-[1px] border-t-0 border-dotted border-gray-700 p-2.5">
                            <table className="min-w-full divide-y divide-gray-200">
                              <tbody className="divide-y divide-gray-200 bg-white text-left">
                                <tr>
                                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                                    Deliver to:
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                                    {CompanyName}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                                    Responsible:
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                                    {SelectedUser}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                                    Price:
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-700">
                                    {ReciptPrice}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : null}
                    {ReceiptCreated ? null : (
                      <div>
                        <div className="flex flex-col gap-2.5">
                          <div className="h-auto">
                            <p className="text-left font-dm text-xl font-bold text-gray-900">
                              {Reference}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="">
                              <label
                                htmlFor="detailed_type_0"
                                className="text-left text-sm font-medium text-gray-900 "
                              >
                                Receive From :
                              </label>
                              <input
                                id="ReceiveFrom"
                                name="ReceiveFrom"
                                type="text"
                                value={ReceiveFrom}
                                onChange={(e) => {
                                  setReceiveFrom(e.target.value);
                                }}
                                required
                                className="col-span-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 "
                              />
                            </div>
                            <div className="">
                              <label
                                htmlFor="SourceDocument"
                                className="text-left text-sm font-medium text-gray-900 "
                              >
                                Source Document :
                              </label>
                              <input
                                id="SourceDocument"
                                name="SourceDocument"
                                type="text"
                                value={SourceDocument}
                                placeholder="e.g. PO0032"
                                onChange={(e) => {
                                  setSourceDocument(e.target.value);
                                }}
                                required
                                className="col-span-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 "
                              />
                            </div>
                          </div>
                          <div className="">
                            <p className="mb-2 border-b border-b-gray-400 pb-2 text-left font-dm text-lg font-bold text-gray-900">
                              Company Info
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <label
                                  htmlFor="companyName"
                                  className="text-left text-sm font-medium text-gray-900"
                                >
                                  Deliver to :
                                </label>{" "}
                                <input
                                  id="companyName"
                                  name="companyName"
                                  type="text"
                                  value={CompanyName}
                                  onChange={(e) => {
                                    setCompanyName(e.target.value);
                                  }}
                                  required
                                  className="col-span-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 "
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="Responsible"
                                  className="text-left text-sm font-medium text-gray-900"
                                >
                                  Responsible :
                                </label>
                                {UserList ? (
                                  <select
                                    className="col-span-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                                    id="Responsible"
                                    value={SelectedUser}
                                    onChange={(e) =>
                                      setSelectedUser(e.target.value)
                                    }
                                  >
                                    {UserList.map((user, userIndex) => (
                                      <option key={userIndex} value={user._id}>
                                        {user.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : null}
                              </div>
                              <div>
                                <label
                                  htmlFor="website"
                                  className="text-left text-sm font-medium text-gray-900 "
                                >
                                  Document Price :
                                </label>
                                <input
                                  id="Price"
                                  name="Price"
                                  type="number"
                                  value={ReciptPrice}
                                  onChange={(e) => {
                                    setReciptPrice(e.target.value);
                                  }}
                                  required
                                  className="col-span-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 "
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 flex flex-col gap-5">
                          <div className="h-auto gap-5">
                            <label
                              htmlFor="detailed_type_0"
                              className="col-span-1 text-left font-dm text-base font-medium text-gray-900"
                            >
                              Scheduled Date :
                              <span className="ml-5 text-base font-bold">
                                {FormateDate(value)}
                              </span>
                            </label>
                            <div className="mt-4 w-max rounded-lg border border-gray-300 bg-gray-100/10 p-2.5">
                              <Calendar onChange={onChangeDate} value={value} />
                            </div>
                          </div>
                        </div>
                        <div className="mb-5 mt-5 flex gap-2">
                          {CanEditDeliveries ? (
                            <button
                              onClick={EditDeliveries}
                              className="rounded-lg bg-blue-500 px-5 py-2 text-left font-dm text-sm font-medium text-white"
                            >
                              Save Deliveries
                            </button>
                          ) : (
                            <button
                              onClick={CreateDeliveries}
                              className="rounded-lg bg-blue-500 px-5 py-2 text-left font-dm text-sm font-medium text-white"
                            >
                              Create Deliveries
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="notPrint flex items-start justify-end">
                    <div className="max-h-[600px] max-w-[400px] overflow-auto">
                      <LogNote DataId={Receipt?._id} type={"Delivery"} />
                    </div>
                  </div>
                </div>

                <div className="notPrint mt-5 mb-5 flex gap-5">
                  {AddProductSign ? (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon
                            className="h-5 w-5 text-green-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Deliveries Created Successfully
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {canAddProduct ? (
                    <div className="rounded-md bg-blue-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <InformationCircleIcon
                            className="h-5 w-5 text-blue-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-700">
                            Add Product Given Below
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                {canAddProduct ? (
                  <>
                    <div className="min-h-[200px] w-full p-5 shadow-lg">
                      <div className="grid grid-cols-1 gap-10">
                        <div className="flex flex-col gap-5">
                          <table className="divide-gra-100 w-full divide-y">
                            <thead className="">
                              <tr className="bg-blueSecondary">
                                <th className="w-[80px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  SKU
                                </th>
                                <th className="w-[80px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Product Name
                                </th>
                                <th className="w-[30px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Qty
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Unit
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Deliveries Date
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Mfg
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Batch
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Price
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Exp
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Pack Qty
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Pack Type
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Total Price
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Box ID
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Refrence Number
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white">
                                  Remark
                                </th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white"></th>
                                <th className="w-[70px] border-r border-r-white py-[1px] text-center font-dm text-[11px] font-bold text-white"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-gra-100 divide-y">
                              {vendors
                                ? vendors.map((vendor, index) => (
                                    <tr key={index} className="mt-5">
                                      <td
                                        data-title={vendor.SKU}
                                        className="w-[80px]"
                                      >
                                        <td className="flex justify-center">
                                          <input
                                            type="text"
                                            value={vendor.SKU}
                                            onChange={(e) =>
                                              handleVendorChange(
                                                index,
                                                "SKU",
                                                e.target.value
                                              )
                                            }
                                            className="flex w-full items-center  justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                          />
                                        </td>
                                      </td>
                                      <td
                                        data-title={
                                          vendor.SKU
                                            ? FindSku(vendor.SKU).name
                                            : ""
                                        }
                                        className="flex h-full w-full gap-2 border border-red-500"
                                      >
                                        {vendor.SKU ? (
                                          <>
                                            <p className="flex w-full cursor-pointer items-center justify-center whitespace-nowrap bg-white/0 p-0.5 text-[10px] outline-none">
                                              {FindSku(vendor.SKU).name}
                                            </p>
                                            <>
                                              <button
                                                title="Click to verify the product"
                                                onClick={() =>
                                                  handleVendorChange(
                                                    index,
                                                    "product",
                                                    FindSku(vendor.SKU)._id
                                                  )
                                                }
                                              >
                                                {vendor.product ===
                                                FindSku(vendor.SKU)._id ? (
                                                  <>
                                                    <p className="text-green-500">
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-circle-check"
                                                      >
                                                        <circle
                                                          cx="12"
                                                          cy="12"
                                                          r="10"
                                                        />
                                                        <path d="m9 12 2 2 4-4" />
                                                      </svg>
                                                    </p>
                                                  </>
                                                ) : (
                                                  <>
                                                    <p className="text-red-500">
                                                      <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-circle-check"
                                                      >
                                                        <circle
                                                          cx="12"
                                                          cy="12"
                                                          r="10"
                                                        />
                                                        <path d="m9 12 2 2 4-4" />
                                                      </svg>
                                                    </p>
                                                  </>
                                                )}
                                              </button>
                                            </>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </td>
                                      <td
                                        data-title={vendor.quantity}
                                        className="w-[30px]"
                                      >
                                        <input
                                          type="text"
                                          value={vendor.quantity}
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "quantity",
                                              e.target.value
                                            )
                                          }
                                          className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                        />
                                      </td>
                                      <td
                                        data-title={vendor.unit}
                                        className="w-[70px]"
                                      >
                                        <select
                                          className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                          value={vendor.unit}
                                          required
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "unit",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Select Unit</option>
                                          <option value="Strip">Strip</option>
                                          <option value="Pouch">Pouch</option>
                                          <option value="Bottle">Bottle</option>
                                          <option value="Blister Pack">
                                            Blister Pack
                                          </option>
                                          <option value="Jar">Jar</option>
                                          <option value="Tube">Tube</option>
                                          <option value="Sachet">Sachet</option>
                                          <option value="Vial">Vial</option>
                                          <option value="Ampoule">
                                            Ampoule
                                          </option>
                                          <option value="Canister">
                                            Canister
                                          </option>
                                          <option value="Carton">Carton</option>
                                          <option value="Other">Other</option>
                                        </select>
                                      </td>
                                      <td
                                        data-title={
                                          vendor.ReceiptDate || new Date()
                                        }
                                        className="w-[70px]"
                                      >
                                        <div className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none">
                                          <DatePicker
                                            className="w-[70px] text-[10px]"
                                            selected={
                                              vendor.ReceiptDate || new Date()
                                            }
                                            onChange={(date) =>
                                              handleVendorChange(
                                                index,
                                                "ReceiptDate",
                                                date
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td
                                        data-title={
                                          vendor?.manufacturing || new Date()
                                        }
                                        className="w-[70px]"
                                      >
                                        <div className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none">
                                          <DatePicker
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                            className="w-[50px] text-[10px]"
                                            selected={
                                              vendor?.manufacturing ||
                                              new Date()
                                            }
                                            onChange={(date) =>
                                              handleVendorChange(
                                                index,
                                                "manufacturing",
                                                date
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td
                                        data-title={vendor.batch}
                                        className="w-[70px]"
                                      >
                                        <input
                                          type="text"
                                          value={vendor.batch}
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "batch",
                                              e.target.value
                                            )
                                          }
                                          className="flex w-full items-center  justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                        />
                                      </td>

                                      <td
                                        data-title={vendor.price}
                                        className="w-[70px]"
                                      >
                                        <input
                                          type="text"
                                          value={vendor.price}
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "price",
                                              e.target.value
                                            )
                                          }
                                          className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                        />
                                      </td>
                                      <td
                                        data-title={
                                          vendor?.expiry || new Date()
                                        }
                                        className="w-[70px]"
                                      >
                                        <div className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none">
                                          <DatePicker
                                            className="w-[70px] text-[10px]"
                                            selected={
                                              vendor?.expiry || new Date()
                                            }
                                            onChange={(date) =>
                                              handleVendorChange(
                                                index,
                                                "expiry",
                                                date
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                      <td
                                        data-title={vendor.packingNo}
                                        className="w-[70px]"
                                      >
                                        <input
                                          type="text"
                                          value={vendor.packingNo}
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "packingNo",
                                              e.target.value
                                            )
                                          }
                                          className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                        />
                                      </td>
                                      <td
                                        data-title={vendor.packingType}
                                        className="w-[70px]"
                                      >
                                        <select
                                          className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                          value={vendor.packingType}
                                          required
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "packingType",
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">Select Unit</option>
                                          <option value="Box">Box</option>
                                          <option value="Carton">Carton</option>
                                          <option value="Other">Other</option>
                                        </select>
                                      </td>
                                      <td
                                        data-title={
                                          vendor.quantity * vendor.price
                                        }
                                        className="flex w-full gap-2 border border-red-500"
                                      >
                                        <input
                                          type="text"
                                          value={vendor.quantity * vendor.price}
                                          onChange={() =>
                                            handleVendorChange(
                                              index,
                                              "TotalPrice",
                                              vendor.quantity * vendor.price
                                            )
                                          }
                                          className="flex  w-full items-center justify-center bg-white/0 px-2 py-1 text-[10px] outline-none"
                                        />
                                        <button
                                          title="Click to verify the product"
                                          onClick={() =>
                                            handleVendorChange(
                                              index,
                                              "TotalPrice",
                                              vendor.quantity * vendor.price
                                            )
                                          }
                                        >
                                          {vendor.quantity * vendor.price ===
                                          vendor.TotalPrice ? (
                                            <>
                                              <p className="text-green-500">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="lucide lucide-circle-check"
                                                >
                                                  <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                  />
                                                  <path d="m9 12 2 2 4-4" />
                                                </svg>
                                              </p>
                                            </>
                                          ) : (
                                            <>
                                              <p className="text-red-500">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  width="16"
                                                  height="16"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  className="lucide lucide-circle-check"
                                                >
                                                  <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                  />
                                                  <path d="m9 12 2 2 4-4" />
                                                </svg>
                                              </p>
                                            </>
                                          )}
                                        </button>
                                      </td>
                                      <td
                                        data-title={vendor.BoxID}
                                        className="w-[70px]"
                                      >
                                        <input
                                          type="text"
                                          value={vendor.BoxID}
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "BoxID",
                                              e.target.value
                                            )
                                          }
                                          className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                        />
                                      </td>
                                      <td
                                        data-title={vendor.RefrenceNumber}
                                        className="w-[70px]"
                                      >
                                        <input
                                          type="text"
                                          value={vendor.RefrenceNumber}
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "RefrenceNumber",
                                              e.target.value
                                            )
                                          }
                                          className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                        />
                                      </td>
                                      <td
                                        data-title={vendor.Remark}
                                        className="w-[70px]"
                                      >
                                        <input
                                          type="text"
                                          value={vendor.Remark}
                                          onChange={(e) =>
                                            handleVendorChange(
                                              index,
                                              "Remark",
                                              e.target.value
                                            )
                                          }
                                          className="flex w-full items-center justify-center border border-red-500 bg-white/0 px-2 py-1 text-[10px] outline-none"
                                        />
                                      </td>
                                      <td className="w-[70px]">
                                        <button
                                          onClick={() => deleteVendor(index)}
                                          className="flex w-full items-center justify-center bg-red-500 px-2 py-1 text-[10px] text-white outline-none"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-circle-x"
                                          >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="m15 9-6 6" />
                                            <path d="m9 9 6 6" />
                                          </svg>
                                        </button>
                                      </td>
                                      <td className="w-[70px]">
                                        <button
                                          onClick={() =>
                                            ProductMap(index, "save")
                                          }
                                          className="flex w-full items-center  justify-center bg-green-500 bg-white/0 px-2 py-1 text-[10px] text-white outline-none"
                                        >
                                          {CheckAddedorNot(vendor.product)
                                            ? "Saved"
                                            : "Save"}
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                : null}
                            </tbody>
                          </table>
                          <button
                            className="notPrint w-max text-left font-dm text-sm font-medium text-green-600"
                            onClick={addVendor}
                          >
                            Add Row +
                          </button>
                          <button
                            className="notPrint w-max rounded-full bg-blueSecondary p-2 px-4 text-left font-dm text-sm font-bold text-white"
                            onClick={() => navigate("/admin/operations")}
                          >
                            Have you added the product? go to receipt list Page
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnyOther;
