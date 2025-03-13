import { Link, useLocation } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
} from "@heroicons/react/24/outline";
import "../Common/Navbar.css";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gyms", href: "/gyms" },
  { name: "Trainers", href: "/trainers" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <Disclosure as="nav" className="navbar">
      {({ open }) => (
        <>
          <div className="navbar-container">
            <div className="navbar-content">
              <div className="navbar-brand">
                <Link to="/" className="brand-name">
                  Gym<span>Hub</span>
                </Link>
              </div>

              <div className="navbar-links">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${
                      location.pathname === item.href ? "active" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="navbar-auth">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>

              <div className="mobile-menu-button-container">
                <Disclosure.Button className="mobile-menu-button">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="mobile-menu">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`mobile-nav-link ${
                  location.pathname === item.href ? "active" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="mobile-auth">
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
