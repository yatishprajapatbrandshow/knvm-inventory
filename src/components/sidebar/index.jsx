/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import logo from "../../images/medhouse-logo.png"
import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0" : "-translate-x-96"
        }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[25px] mb-0 flex items-start flex-col justify-center gap-2`}>
        <img
          src={logo}
          alt="logo"
          className="w-20 h-20"
        />
        <div className="mt-1 ml-1 font-poppins text-3xl font-bold uppercase text-navy-700 dark:text-white">
          Med House<br /><span class="font-medium capitalize text-base whitespace-normal">Inventory Management<br />System</span>
        </div>
      </div>
      <div class="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1 overflow-y-scroll h-[55vh]">
        <Links routes={routes} />
      </ul>

      {/* Free Horizon Card */}
      {/* <div className="flex justify-center">
        <SidebarCard />
      </div> */}

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
