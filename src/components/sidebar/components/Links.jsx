/* eslint-disable */
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import DashIcon from "components/icons/DashIcon";
import { isSessionActive } from 'utils/sessionUtils';
// chakra imports

export function SidebarLinks(props) {
  const navigate = useNavigate();
  // Chakra color mode
  let location = useLocation();

  const { routes } = props;

  const Session = isSessionActive()
  useEffect(() => {
    if (!Session) {
      navigate('/login');
    }
  })

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };



  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        return (
          <div key={index}>
            <div className="relative mb-3 flex flex-col hover:cursor-pointer">
              <Link
                // to={route.layout + "/" + route.path}
                className="my-[3px] flex cursor-pointer items-center px-8"
                key={index}
              >
                <span
                  className={`${activeRoute(route.path) === true
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-900"
                    }`}
                >
                  {route.icon ? route.icon : <DashIcon />}{" "}
                </span>
                <p
                  className={`leading-1 ml-4 flex text-sm  ${activeRoute(route.path) === true
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-900"
                    }`}
                >
                  {route.name}
                </p>
              </Link> 
              {route.submenu ?
                <div className="ml-20">
                  {route.submenu.map((item, index) => (

                    <button key={index}
                      className={`relative w-full flex text-xs  hover:text-brand-500   text-gray-600 mb-1`}
                      // to={item.layout + "/" + item.path + "/" + item.subpath}
                      onClick={() => navigate(item.subpath)}
                    >{item.name}
                    </button>
                  ))}
                </div>
                : null}
              {activeRoute(route.path) ? (
                <div class="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>
          </div>
        );
      }
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;
