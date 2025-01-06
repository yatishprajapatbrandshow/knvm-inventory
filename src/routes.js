import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import Warehouse from "views/admin/warehouse";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";
import {
  FaReceipt,
  FaFileInvoiceDollar,
  FaRegUser,
  FaDollarSign,
} from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
const routes = [
  // {
  //   name: "Warehouse",
  //   layout: "/admin",
  //   path: "warehouse",
  //   icon: <MdHome className="h-5 w-5" />,
  //   component: <Warehouse />,
  // },
  {
    name: "Products",
    layout: "/admin",
    path: "products",
    icon: <MdHome className="h-5 w-5" />,
    component: <MainDashboard />,
    submenu: [
      {
        name: "Add Product",
        subpath: "/admin/products/add",
        icon: <MdHome className="h-5 w-5" />,
      },
      {
        name: "Product List",
        subpath: "/admin/products/list",
        icon: <MdHome className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Reciepts",
    layout: "/admin",
    path: "operations",
    icon: <FaReceipt className="h-4 w-4   " />,
    component: <NFTMarketplace />,
    secondary: true,
    submenu: [
      {
        name: "Create Receipts",
        subpath: "/receipts",
        icon: <MdHome className="h-5 w-5" />,
      },
      {
        name: "Recipts List",
        subpath: "/receipts/list",
        icon: <MdHome className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Delivery",
    layout: "/admin",
    path: "operations",
    icon: <TbTruckDelivery className="h-5 w-5" />,
    component: <NFTMarketplace />,
    secondary: true,
    submenu: [
      {
        name: "Delivery List",
        subpath: "/delivery/list",
        icon: <MdHome className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Invocies",
    layout: "/admin",
    path: "operations",
    icon: <FaFileInvoiceDollar className="  " />,
    component: <NFTMarketplace />,
    secondary: true,
    submenu: [
      {
        name: "Create Invoice",
        subpath: "/invoice",
        icon: <MdHome className="h-5 w-5" />,
      },
      {
        name: "Invoice List",
        subpath: "/invoice/list",
        icon: <MdHome className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Customers",
    layout: "/admin",
    path: "operations",
    icon: <FaRegUser className="h-4 w-4" />,
    component: <NFTMarketplace />,
    secondary: true,
    submenu: [
      {
        name: "Add/Edit Customer",
        subpath: "/customer",
        icon: <MdHome className="h-4 w-5" />,
      },
      {
        name: "Customer List",
        subpath: "/customer/list",
        icon: <MdHome className="h-5 w-5" />,
      },
      // {
      //   name: "Create Payment",
      //   subpath: "/payment",
      //   icon: <MdHome className="h-5 w-5" />,
      // },
    ],
  },
  {
    name: "Payments",
    layout: "/admin",
    path: "operations",
    icon: <FaDollarSign className="h-5 w-5" />,
    component: <NFTMarketplace />,
    secondary: true,
    submenu: [
      {
        name: "Create Payment",
        subpath: "/payment",
        icon: <MdHome className="h-5 w-5" />,
      },
      {
        name: "Payment List",
        subpath: "/payment/list",
        icon: <MdHome className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Reporting",
    layout: "/admin",
    icon: <MdBarChart className="h-5 w-5" />,
    path: "reporting",
    component: <DataTables />,
    submenu: [
      {
        name: "Stock Register",
        subpath: "/stockregister",
        icon: <MdHome className="h-5 w-5" />,
      },
      {
        name: "Total Sales",
        subpath: "/totalsales",
        icon: <MdHome className="h-5 w-5" />,
      },
      {
        name: "All Data",
        subpath: "/allData",
        icon: <MdHome className="h-5 w-5" />,
      },
    ],
  },
];
export default routes;
