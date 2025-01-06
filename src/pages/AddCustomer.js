import Navbar from "pages/Navbar";
import { useEffect, useState, useRef } from "react";
import { API_NEW_URL, X_API_Key } from "../config";
import { isSessionActive } from "utils/sessionUtils";
import { useNavigate, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useReactToPrint } from "react-to-print";
import ErrorBox from "components/errorBox/ErrorBox";

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

  useEffect(() => {
    if (!Session) navigate("/login");
  }, []);

  const [CompanyName, setCompanyName] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [Email, setEmail] = useState(null);
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Street, setStreet] = useState("");
  const [City, setCity] = useState("");
  const [State, setState] = useState("");
  const [Zip, setZip] = useState("");

  const [EditCompanyName, setEditCompanyName] = useState("");
  const [EditCustomerName, setEditCustomerName] = useState("");
  const [EditEmail, setEditEmail] = useState("");
  const [EditPhone, setEditPhone] = useState("");
  const [EditAddress, setEditAddress] = useState("");
  const [EditStreet, setEditStreet] = useState("");
  const [EditCity, setEditCity] = useState("");
  const [EditState, setEditState] = useState("");
  const [EditZip, setEditZip] = useState("");
  const [Edit_id, setEdit_id] = useState("");

  const [openEditPopup, setOpenEditPopup] = useState(false);

  const [ErrorMessage, setErrorMessage] = useState(false);
  const [CustomerList, setCustomerList] = useState("");

  // Refresh State
  const refreshState = () => {
    setCompanyName("");
    setCustomerName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setStreet("");
    setCity("");
    setState("");
    setZip("");
  };
  // Validate Email
  const validateEmail = (email) => {
    // Enhanced regex for stricter email validation
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return re.test(email);
  };
  // Validate PhoneNumber
  const validatePhone = (phone) => {
    const re = /^[0-9\b]+$/;
    return re.test(phone);
  };
  // Vakidate Fields
  const validateFields = (
    CompanyName,
    CustomerName,
    Email,
    Phone,
    Street,
    City,
    State,
    Zip
  ) => {
    let errorBox = [];

    if (!CustomerName) {
      errorBox.push("Customer Name field is required.");
    }
    if (!CompanyName) {
      errorBox.push("Company Name field is required.");
    }
    if (Email) {
      if (!validateEmail(Email)) {
        errorBox.push("Invalid Email Address.");
      }
    }
    if (!Phone && !validatePhone(Phone)) {
      errorBox.push("Phone number should only contain digits.");
    }

    return errorBox;
  };
  //Create Customer
  const CreateCustomer = async () => {
    setErrorMessage("");

    const errors = validateFields(
      CompanyName,
      CustomerName,
      Email,
      Phone,
      Street,
      City,
      State,
      Zip
    );

    if (errors.length > 0) {
      setErrorMessage(errors);
      console.log(ErrorMessage);
      return;
    }
    const datas = {
      name: CustomerName,
      companyName: CompanyName,
      email: Email,
      phone: Phone,
      address: {
        street: Street,
        city: City,
        state: State,
        zip: Zip,
      },
    };

    // const apiUrl = `${API_NEW_URL}customer/add`;
    const apiUrl = `${API_NEW_URL}customer/add`;

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
        getCustomer();
        refreshState();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Delete Customer
  const DeleteCustomer = async (item) => {
    const datas = {
      name: item.name,
      companyName: item.companyName,
      email: item.email,
      phone: item.phone,
      address: { ...item.address },
      status: false,
    };
    console.log(datas);

    const apiUrl = `${API_NEW_URL}customer/add`;
    // const apiUrl = `${API_NEW_URL}customer/add`;

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
      if (data.status === true) {
        alert(data.message);
        getCustomer();
      } else {
      }
    } catch (error) { }
  };
  // Edit Customer
  const EditCustomer = async () => {
    // const date = new Date(value);
    // date.setUTCHours(12, 0, 0, 0);
    // const formattedDateStr = date.toISOString();

    setErrorMessage("");

    console.log(
      EditCompanyName,
      EditCustomerName,
      EditEmail,
      EditPhone,
      EditStreet,
      EditCity,
      EditState,
      EditZip
    );
    const errors = validateFields(
      EditCompanyName,
      EditCustomerName,
      EditEmail,
      EditPhone,
      EditStreet,
      EditCity,
      EditState,
      EditZip
    );

    if (errors.length > 0) {
      setErrorMessage(errors);
      console.log(ErrorMessage);
      return;
    }

    const datas = {
      name: EditCustomerName,
      companyName: EditCompanyName,
      email: EditEmail,
      phone: EditPhone,
      address: {
        street: EditStreet,
        city: EditCity,
        state: EditState,
        zip: EditZip,
      },
    };

    const apiUrl = `${API_NEW_URL}customer/edit/${Edit_id}`;

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
        getCustomer();
        setOpenEditPopup(false);
      } else {
      }
    } catch (error) { }
  };
  // Get Customer
  const getCustomer = async () => {
    // const apiUrl = `http://localhost:3001/api/customer/list?name=&page=1&limit=25'`;
    const apiUrl = `${API_NEW_URL}customer/list?name=&page=1&limit=25'`;
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
        setCustomerList(data.customers);
      } else {
        alert("Something went wrong please try again");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch the customer list
  useEffect(() => {
    getCustomer();
  }, []);

  // Edit Popup Open
  const EditPopupOpen = (data) => {
    setEditCompanyName(data.companyName);
    setEditCustomerName(data.name);
    setEditEmail(data.email);
    setEditPhone(data.phone);
    setEditStreet(data.address.street);
    setEditCity(data.address.city);
    setEditState(data.address.state);
    setEditZip(data.address.zip);
    setEdit_id(data._id);
    setOpenEditPopup(true);
    console.log(data);
  };

  return (
    <>
      <div className="mx-auto p-5">
        <Navbar
          logoText={"Medhouse Pharma - Inventory Management System"}
          brandText={"Add Customer"}
        />
        <div className="grid grid-cols-2 gap-10">
          {/* Error Message */}
          {ErrorMessage ? (
            <ErrorBox
              errors={ErrorMessage}
              setErrors={setErrorMessage}
              duration={5000}
            />
          ) : (
            <></>
          )}
          {/* Add Customer */}
          <div className="flex flex-col gap-2.5 rounded-lg bg-white p-5">
            <div className="rounded-lg bg-blue-100 p-1">
              <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                Company Name:
              </label>
              <input
                className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                type="text"
                value={CompanyName}
                pattern="[0-9]*"
                required
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-blue-100 p-1">
              <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                Customer Name:
              </label>
              <input
                className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                type="text"
                value={CustomerName}
                pattern="[0-9]*"
                required
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-blue-100 p-1">
              <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                Email:
              </label>
              <input
                className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                type="text"
                value={Email}
                pattern="[0-9]*"
                required
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </div>
            <div className="rounded-lg bg-blue-100 p-1">
              <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                Phone:
              </label>
              <input
                className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                type="text"
                value={Phone}
                pattern="[0-9]*"
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="rounded-lg bg-blue-200 p-1">
              <label className="mb-1 block min-w-[120px] px-1 font-bold text-gray-900">
                Address:
              </label>
              {/* <input
                    className={`bg-white p-2.5 rounded-lg flex-1 text-gray-900 text-sm block w-full`}
                    type="text"
                    value={Address}
                    pattern="[0-9]*"
                    required
                    onChange={(e) => setAddress(e.target.value)}
                /> */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                    Street:
                  </label>
                  <input
                    className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                    type="text"
                    value={Street}
                    pattern="[0-9]*"
                    required
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                    City:
                  </label>
                  <input
                    className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                    type="text"
                    value={City}
                    pattern="[0-9]*"
                    required
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                    State:
                  </label>
                  <input
                    className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                    type="text"
                    value={State}
                    pattern="[0-9]*"
                    required
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                    Zip:
                  </label>
                  <input
                    className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                    type="text"
                    value={Zip}
                    pattern="[0-9]*"
                    required
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={CreateCustomer}
                className="rounded-lg bg-blue-500 py-2.5 px-4 text-sm text-white"
              >
                Add New Customer
              </button>
            </div>
          </div>
          {openEditPopup ? (
            <div className="absolute top-0 left-0 z-50 flex h-full w-full items-center justify-center">
              <div
                onClick={() => setOpenEditPopup(false)}
                className="absolute z-0 h-full w-full backdrop-blur-2xl"
              />
              <div
                onClick={() => setOpenEditPopup(false)}
                className="absolute right-0 top-0 z-10 flex h-10 w-10 cursor-pointer items-center justify-center bg-red-500 text-white"
              >
                X
              </div>
              <div className="relative z-10 w-full max-w-xl">
                <div className="flex flex-col gap-2.5 rounded-lg bg-white p-5">
                  <div className="rounded-lg bg-blue-100 p-1">
                    <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                      Company Name:
                    </label>
                    <input
                      className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                      type="text"
                      value={EditCompanyName}
                      pattern="[0-9]*"
                      required
                      onChange={(e) => setEditCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-blue-100 p-1">
                    <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                      Customer Name:
                    </label>
                    <input
                      className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                      type="text"
                      value={EditCustomerName}
                      pattern="[0-9]*"
                      required
                      onChange={(e) => setEditCustomerName(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-blue-100 p-1">
                    <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                      Email:
                    </label>
                    <input
                      className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                      type="text"
                      value={EditEmail}
                      pattern="[0-9]*"
                      required
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-blue-100 p-1">
                    <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                      Phone:
                    </label>
                    <input
                      className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                      type="text"
                      value={EditPhone}
                      pattern="[0-9]*"
                      required
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-blue-200 p-1">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                          Street:
                        </label>
                        <input
                          className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                          type="text"
                          value={EditStreet}
                          pattern="[0-9]*"
                          required
                          onChange={(e) => setEditStreet(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                          City:
                        </label>
                        <input
                          className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                          type="text"
                          value={EditCity}
                          pattern="[0-9]*"
                          required
                          onChange={(e) => setEditCity(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                          State:
                        </label>
                        <input
                          className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                          type="text"
                          value={EditState}
                          pattern="[0-9]*"
                          required
                          onChange={(e) => setEditState(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block min-w-[120px] px-1 text-gray-700">
                          Zip:
                        </label>
                        <input
                          className={`block w-full flex-1 rounded-lg bg-white p-2.5 text-sm text-gray-900`}
                          type="text"
                          value={EditZip}
                          pattern="[0-9]*"
                          required
                          onChange={(e) => setEditZip(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={EditCustomer}
                      className="rounded-lg bg-blue-500 py-2.5 px-4 text-sm text-white"
                    >
                      Update Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {/* Customer List */}
          <div className="gap-2.5 rounded-lg bg-white p-5">
            <p className="text-lg font-bold text-gray-800">Customer List</p>
            <div className="grid grid-cols-2 gap-2.5">
              {CustomerList ? (
                <>
                  {CustomerList.map((item, index) => (
                    <div
                      onClick={() => EditPopupOpen(item)}
                      className="relative rounded-lg border border-blue-300 bg-blue-50 p-2.5"
                      key={index} // Adding key for better performance
                    >
                      <p className="text-lg font-bold">{item.companyName}</p>
                      <p className="text-sm">{item.name}</p>
                      <div>
                        <p className="text-sm text-gray-700">{item.email}</p>
                        <p className="text-sm text-gray-700">{item.phone}</p>
                        <p className="my2 font-bold">address</p>
                        <p className="text-sm text-gray-700">
                          {item.address.city}
                        </p>
                        <p className="text-sm text-gray-700">
                          {item.address.street}
                        </p>
                        <p className="text-sm text-gray-700">
                          {item.address.state}
                        </p>
                        <p className="text-sm text-gray-700">
                          {item.address.zip}
                        </p>
                      </div>
                      {/* Delete Customer Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Stop event from propagating to the parent div
                          DeleteCustomer(item);
                        }}
                        className="absolute top-0 right-0 p-1 text-sm text-white"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                        >
                          <path d="M3 6h18" />
                          <path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnyOther;
