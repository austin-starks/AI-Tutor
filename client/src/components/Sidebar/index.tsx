import { IconContainer, Sidebar, SidebarLink } from "./styles";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface SidebarProps {
  links: {
    onClick: () => void;
    text: string;
    icon: React.ReactElement;
  }[];
}

const SideBar = (props: SidebarProps) => {
  return (
    <>
      <IconContainer>
        <MenuIcon />
      </IconContainer>
      <Sidebar>
        {props.links.map((link) => {
          return (
            <SidebarLink onClick={link.onClick}>
              <Box my={1}>{link.text}</Box>
              <Box my={1}> {link.icon}</Box>
            </SidebarLink>
          );
        })}
      </Sidebar>
    </>
  );
};

export default SideBar;
