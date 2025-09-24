import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { useAuth } from "../contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { DEFAULT_AVATAR } from "../utils/constants";

// Navbar wrapper
const Nav = styled.nav`
  background: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
`;

// Container
const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

// Logo
const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #666;
  }
`;

// Desktop links
const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* hide on small screens */
  }
`;

// Mobile menu
const MobileMenu = styled.div`
  position: absolute;
  top: 70px;
  right: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 200px;
  transition: all 0.3s ease;
`;

// Nav link
const NavLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

// Profile section
const ProfileSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

// Dropdown
const DropdownMenu = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 200px;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: translateY(${(props) => (props.isOpen ? "0" : "-10px")});
  transition: all 0.3s ease;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &.logout {
    color: #ff5f6d;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #ff5f6d;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

// Avatar
const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

// Login button
const LoginButton = styled(Link)`
  background: linear-gradient(135deg, #ff8a00 0%, #ff5f6d 100%);
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(255, 95, 109, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 95, 109, 0.3);
    background: linear-gradient(135deg, #ff9a20 0%, #ff6f7d 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(255, 95, 109, 0.2);
  }
`;

// Hamburger icon
const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 25px;
    height: 3px;
    background: #333;
    border-radius: 2px;
    transition: 0.3s;
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">
          <span>📝</span> BlogSpace
        </Logo>

        {/* Desktop links */}
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/explore">Explore</NavLink>
          {user ? (
            <ProfileSection
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              ref={dropdownRef}
            >
              <Avatar
                src={user?.avatar || DEFAULT_AVATAR}
                alt={user?.name || "User"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <DropdownMenu isOpen={isDropdownOpen}>
                <DropdownItem to="/profile">
                  <span>👤</span> Profile
                </DropdownItem>
                <DropdownItem to="/settings">
                  <span>⚙️</span> Settings
                </DropdownItem>
                <LogoutButton onClick={handleLogout}>
                  <span>🚪</span> Logout
                </LogoutButton>
              </DropdownMenu>
            </ProfileSection>
          ) : (
            <LoginButton to="/login">Sign In</LoginButton>
          )}
        </NavLinks>

        {/* Mobile Hamburger */}
        <Hamburger onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span />
          <span />
          <span />
        </Hamburger>
      </NavContainer>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu>
          <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/explore" onClick={() => setIsMobileMenuOpen(false)}>
            Explore
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                👤 Profile
              </NavLink>
              <NavLink
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ⚙️ Settings
              </NavLink>
              <LogoutButton
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                🚪 Logout
              </LogoutButton>
            </>
          ) : (
            <LoginButton to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              Sign In
            </LoginButton>
          )}
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;
