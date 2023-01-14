import { IconContainer, Sidebar, SidebarLink } from "./styles";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";

interface SidebarProps {
  links: { onClick: () => void; text: string }[];
}

const SideBar = (props: SidebarProps) => {
  return (
    <>
      <IconContainer>
        <MenuIcon />
      </IconContainer>
      <Sidebar>
        {props.links.map((link) => {
          return <SidebarLink onClick={link.onClick}>{link.text}</SidebarLink>;
        })}
      </Sidebar>
    </>
  );
};

export default SideBar;
