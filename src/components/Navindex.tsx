import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@heroui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";


export default function Navindex() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-transparent! shadow-sm!">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit  text-blue-700! text-xl">MickQz</p>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop menu */}
      <NavbarContent className="hidden sm:flex gap-15" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={location.pathname === item.path}>
            <RouterLink
              to={item.path}
              className={`transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700 hover:text-blue-700"
              }`}
            >
              {item.name}
            </RouterLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={RouterLink} to="/signup"  className="px-5 bg-blue-700 text-white hover:bg-blue-750 rounded-md font-medium" >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <RouterLink
              to={item.path}
              className={`w-full text-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700 hover:text-blue-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </RouterLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}