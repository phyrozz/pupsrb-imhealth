import React from 'react'
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarContent, NavbarItem, Button, Link, NavbarMenuItem, NavbarMenu } from '@nextui-org/react'
import menuItems from '../data/navbar-menu-items.json'

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
        {menuItems.map((item, index) => (
          <NavbarMenuItem isActive={props.activeLink === item.name ? true : false} key={`${item}-${index}`}>
            <Link className="w-full" isBlock color="foreground" href={item.href}>{item.name}</Link>
          </NavbarMenuItem>
        ))}
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
          <NavbarMenuItem isActive={props.activeLink === item.name ? true : false} key={`${item}-${index}`}>
            <Link className="w-full" isBlock color="foreground" href={item.href}>{item.name}</Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
