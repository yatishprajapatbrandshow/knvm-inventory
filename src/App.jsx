import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import Login from "views/auth/SignIn";
import { isSessionActive } from "utils/sessionUtils";
import ProductDetails from "pages/ProductDetails";
import Receipts from "pages/Receipts";
import Deliveries from "pages/Deliveries";
import StockRegister from "pages/StockRegister";
import Invoice from "pages/Invoice";
import AddCustomer from "pages/AddCustomer";
import DeliveriesChalanPrint from "pages/DeliveriesChalanPrint";
import InvoicePrint from "pages/InvoicePrint";
import Payment from "pages/Payment";
import RecieptsList from "pages/RecieptsList";
import InvoiceList from "pages/InvoiceList";
import CustomerList from "pages/CustomerList";
import PaymentList from "pages/PaymentList";
import ProductList from "pages/ProductList";
import DeliveryList from "pages/DeliveryList";
import ProductPrint from "pages/ProductPrint";
import CustomerInvoicePayment from "pages/CustomerInvoicePayment";
import AllData from "pages/AllData";
import TotalSell from "pages/TotalSell";
import CustomerPrintPayment from "pages/CustomerPrintPayment";
import StockPrintDetails from "pages/StockPrintDetails";
const App = () => {
  const Session = isSessionActive();
  return (
    <Routes>
      {/* {Session ?
        <Route path="/" element={<Navigate to="/admin" replace />} />
        :
        <Route path="/*" element={<Navigate to="/login" replace />} />
      } */}
      <Route path="/" element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="/admin/products/add" element={<ProductDetails />} />
      <Route path="/admin/products/list" element={<ProductList />} />
      <Route path="receipts" element={<Receipts />} />
      <Route path="receipts/list" element={<RecieptsList />} />
      <Route path="deliveries" element={<Deliveries />} />
      <Route path="delivery/list" element={<DeliveryList />} />
      <Route path="stockregister" element={<StockRegister />} />
      <Route path="invoice" element={<Invoice />} />
      <Route path="invoice/list" element={<InvoiceList />} />
      <Route path="customer" element={<AddCustomer />} />
      <Route path="customer/list" element={<CustomerList />} />
      <Route
        path="customer/payment-history"
        element={<CustomerInvoicePayment />}
      />
      <Route
        path="customer/customer-payment-print"
        element={<CustomerPrintPayment />}
      />
      <Route path="payment" element={<Payment />} />
      <Route path="payment/list" element={<PaymentList />} />
      <Route path="deliverieschalan" element={<DeliveriesChalanPrint />} />
      <Route path="invoiceprint" element={<InvoicePrint />} />
      <Route path="productListPrint" element={<ProductPrint />} />
      <Route path="/allData" element={<AllData />} />
      <Route path="/totalsales" element={<TotalSell />} />
      <Route path="/stockPrintDetails" element={<StockPrintDetails />} />
    </Routes>
  );
};

export default App;
