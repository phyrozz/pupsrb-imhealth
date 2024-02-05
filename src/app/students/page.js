import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Link } from '@nextui-org/react';

export default function Students() {
	return (
		<div className="bg-gradient-to-r from-slate-50 to-slate-300 h-screen">
			<Navbar shouldHideOnScroll isBordered>
        <NavbarBrand>
          <p className="text-xl font-bold text-black">PUP-iMHealth</p>
        </NavbarBrand>
        <NavbarContent>
          <NavbarItem>
            <Link isBlock color="foreground" href="/dashboard">Dashboard</Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link isBlock color="foreground" href="/students">Students</Link>
          </NavbarItem>
          <NavbarItem>
            <Link isBlock color="foreground" href="/my-account">My Account</Link>
          </NavbarItem>
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
      </Navbar>
		</div>
	)
}