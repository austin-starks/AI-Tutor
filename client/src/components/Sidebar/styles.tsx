import { Box, Link } from "@mui/material";
import styled from "styled-components";

export const Sidebar = styled("div")`
  position: absolute;
  left: 0;
  top: 60px;
  padding-top: -240px;
  bottom: 0;
  width: 100px;
  background-color: #1876d1;
  align-items: center;
  justify-content: space-around;
  display: flex;
  flex-direction: column;
  @media (max-width: 767px) {
    display: none;
  }
`;

export const IconContainer = styled(Box)`
  @media (min-width: 767px) {
    display: none;
  }
  position: relative;
  left: -6%;
  &:hover {
    cursor: pointer;
  }
`;

export const SidebarLink = styled("div")`
  padding-top: 25%;
  color: white;
  font-family: "Stencil Std", sans-serif;
  width: 100%;
  height: 100%;
  top: 50%;
  align-items: center;
  text-align: center;
  z-index: 1;
  &:hover {
    cursor: pointer;
    background-color: #1664c0;
  }
`;
