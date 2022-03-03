import { useRouter } from "next/router";
import Link from "next/link";
import { Menu, Container, Icon } from "semantic-ui-react";

const Navbar = () => {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;
  return (
    <Menu color="purple" borderless fluid>
      <Container text>
        <Link href="/login">
          <Menu.Item active={isActive("/login")}>
            <Icon size="large" name="sign in" />
            Login
          </Menu.Item>
        </Link>

        <Link href="/signup">
          <Menu.Item active={isActive("/signup")}>
            <Icon size="large" name="signup" />
            Sign Up
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  );
};

export default Navbar;
