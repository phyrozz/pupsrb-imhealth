"use client"
import React from 'react'
import { 
  Navbar, NavbarBrand, NavbarMenuToggle, NavbarContent, NavbarItem, 
  Button, 
  Link, 
  NavbarMenuItem, NavbarMenu,
  DropdownItem, DropdownTrigger, Dropdown, DropdownMenu
} from '@nextui-org/react'
import menuItems from '../data/navbar-menu-items.json'
import { ChevronDown } from '../icons/chevron-icon'

export default function CustomNavbar(props) {
  const activeLink = props.activeLink

  return (
    <Navbar shouldHideOnScroll isBordered>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle className='text-slate-900' />
        <NavbarBrand>
          <p className="text-xl font-bold text-black">PUP-iMHealth</p>
        </NavbarBrand>
      </NavbarContent>
      
      <NavbarContent className="sm:flex hidden" justify="center">
        {menuItems.map((item, index) => {
          if (typeof item.dropdownItems !== 'undefined') {
            return (
              <Dropdown key={index}>
                <NavbarItem>
                  <DropdownTrigger>
                    <Button
                      disableRipple
                      endContent={<ChevronDown fill="currentColor" size={16} />}
                      variant="light"
                      className={activeLink === item.name ? "px-2 py-0 text-md font-semibold" : "px-2 py-0 text-md"}
                      href={item.href}
                    >
                      {item.name}
                    </Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu
                  aria-label="Dropdown Menu Items"
                  className="w-[340px]"
                  itemClasses={{
                    base: "gap-4",
                  }}
                >
                  {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                    <DropdownItem
                      key={dropdownIndex}
                      description={dropdownItem.description}
                      href={dropdownItem.href}
                    >
                      {dropdownItem.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )
          } else {
            return (
              <NavbarMenuItem isActive={activeLink === item.name} key={`${item}-${index}`}>
                <Link className="w-full" isBlock color="foreground" href={item.href}>{item.name}</Link>
              </NavbarMenuItem>
            )
          }
        })}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <form action="/auth/signout" method="post">
            <Button type="submit" color="danger" variant="shadow">
              Log out
            </Button>
          </form>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem isActive={activeLink === item.name} key={`${item}-${index}`}>
            <Link className="w-full" isBlock color="foreground" href={item.href}>{item.name}</Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
