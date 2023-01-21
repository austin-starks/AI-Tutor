import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Header } from "./styles";
import { logout } from "../../requests/user";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { modalAtom, ModalType } from "../Modal";
import { bannerAtom } from "../Banner";
import { useNavigate } from "react-router-dom";

const appName = "StarkTech Tutor";

function ResponsiveAppBar(props: { sx?: any }) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [, setModalType] = useAtom(modalAtom);
  const [, setBanner] = useAtom(bannerAtom);
  const navigate = useNavigate();
  const pages: { name: string; onClick: () => void }[] = [
    {
      name: "Get Free Coins",
      onClick: () => {
        setModalType(ModalType.Referral);
      },
    },
    {
      name: "Buy Coins",
      onClick: () => {
        setModalType(ModalType.Payment);
      },
    },
  ];
  return (
    <Header position="static">
      <Box sx={props.sx} mx={5}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              color: "inherit",
              textDecoration: "none",
              fontFamily: "monospace",
              fontWeight: 700,
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            {appName}
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>{appName}</Box>
            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
              }}
            >
              ST
            </Box>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          ></Box>
          {Cookies.get("jwt") &&
            pages.map((page) => (
              <Typography
                sx={{ "&:hover": { cursor: "pointer" } }}
                mr={4}
                key={page.name}
                onClick={() => {
                  page.onClick();
                }}
                variant="body2"
              >
                {page.name}
              </Typography>
            ))}
          <Box>
            <Tooltip title="Open User Menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
            {Cookies.get("jwt") ? (
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    logout().then(() => {
                      handleCloseUserMenu();
                      setBanner({
                        message: "Logged out successfully",
                        severity: "success",
                      });
                    });
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            ) : (
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    setModalType(ModalType.Authentication);
                  }}
                >
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
              </Menu>
            )}
          </Box>
        </Toolbar>
      </Box>
    </Header>
  );
}
export default ResponsiveAppBar;
