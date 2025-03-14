import { Link, useLocation, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import "../Common/Navbar.css";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gyms", href: "/gyms" },
  { name: "Trainers", href: "/trainers" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

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
                {user ? (
                  <Menu as="div" className="user-menu">
                    <Menu.Button className="user-menu-button">
                      <span className="user-name">{user.name}</span>
                      <UserCircleIcon
                        className="profile-icon"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="user-dropdown">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={`dropdown-item ${
                                active ? "active" : ""
                              }`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`dropdown-item ${
                                active ? "active" : ""
                              }`}
                            >
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary">
                      Register
                    </Link>
                  </>
                )}
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
              {user ? (
                <>
                  <Link to="/dashboard" className="mobile-nav-link">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="mobile-nav-link">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Register
                  </Link>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
