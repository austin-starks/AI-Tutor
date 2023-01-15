import { IconContainer, Sidebar, SidebarLink } from "./styles";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import { SubjectEnum } from "../../requests/question";
import CalculateIcon from "@mui/icons-material/Calculate";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import BiotechIcon from "@mui/icons-material/Biotech";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ComputerIcon from "@mui/icons-material/Computer";

const sidebarLinks = [
  {
    text: SubjectEnum.GENERAL,
    onClick: () => {
      alert("Feature coming soon!");
    },
    icon: <QuestionMarkIcon />,
  },
  {
    text: SubjectEnum.SCIENCE,
    onClick: () => {
      alert("Feature coming soon!");
    },
    icon: <BiotechIcon />,
  },
  {
    text: SubjectEnum.ENGLISH,
    onClick: () => {
      alert("Feature coming soon!");
    },
    icon: <AutoStoriesIcon />,
  },
  {
    text: SubjectEnum.HISTORY,
    onClick: () => {
      alert("Feature coming soon!");
    },
    icon: <MenuBookIcon />,
  },
  {
    text: SubjectEnum.MATH,
    onClick: () => {
      alert("Feature coming soon!");
    },
    icon: <CalculateIcon />,
  },
  {
    text: "Computing",
    onClick: () => {
      alert("Feature coming soon!");
    },
    icon: <ComputerIcon />,
  },
];

interface SidebarProps {}

const SideBar = (props: SidebarProps) => {
  return (
    <>
      <IconContainer>
        <MenuIcon />
      </IconContainer>
      <Sidebar>
        {sidebarLinks.map((link) => {
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
