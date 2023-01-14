import { Box, Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { balanceAtom } from "../../components/Balance";
import Banner, { bannerAtom, useAtom } from "../../components/Banner";
import { modalAtom } from "../../components/Modal";
import SideBar from "../../components/Sidebar";
import { catchServerError } from "../../requests/common";
import {
  ask,
  getQuestionCosts,
  QuestionCost,
  QuestionRequest,
  SubjectEnum,
} from "../../requests/question";
import { getBalance } from "../../requests/user";
import AnswerBox from "./AnswerBox";
import QuestionBox from "./QuestionBox";
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

const Home = () => {
  const [answer, setAnswer] = useState<string>("");
  const [lastSubmittedQuestion, setLastSubmittedQuestion] =
    useState<QuestionRequest | null>(null);
  const [lastQuestionId, setLastQuestionId] = useState<string>("null");
  const [, setModalType] = useAtom(modalAtom);
  const [banner, setBanner] = useAtom(bannerAtom);
  const handleClose = () => {
    setBanner((b) => ({ ...b, message: "" }));
  };
  const [costs, setCosts] = useState<QuestionCost | null>(null);
  const [balance, setBalance] = useAtom(balanceAtom);

  const onSubmit = async (question: QuestionRequest) => {
    return ask(question)
      .then((res) => {
        setAnswer(res.data.answer);
        setLastSubmittedQuestion(question);
        setLastQuestionId(res.data.id || "");
        setBalance(res.data.balance);
      })
      .catch((err) => catchServerError(err, setModalType, setBanner));
  };

  useEffect(() => {
    getQuestionCosts()
      .then((res) => {
        setCosts(res.data.costs);
      })
      .catch((err) => catchServerError(err, setModalType, setBanner));
  }, []);

  useEffect(() => {
    if (Cookies.get("jwt")) {
      getBalance()
        .then((res) => {
          setBalance(res.data.balance);
        })
        .catch((err) => catchServerError(err, setModalType, setBanner));
    }
  }, []);

  return (
    <Box margin="1.5rem auto" width={"85%"}>
      <Banner banner={banner} handleClose={handleClose} />
      {/* <SideBar links={sidebarLinks} /> */}
      <Box>
        <Typography variant="body2" color="text.secondary" align="center">
          Please note that we are in active development to make the AI faster
          and more accurate.
        </Typography>
        <Typography
          fontWeight={"bold"}
          variant="body2"
          color="text.secondary"
          align="center"
        >
          Your feedback makes the AI much more intelligent!
        </Typography>
      </Box>
      <Grid container>
        <Grid item xs={12} md={6}>
          <QuestionBox balance={balance} costs={costs} onSubmit={onSubmit} />
        </Grid>
        <Grid item xs={12} md={6}>
          <AnswerBox
            lastQuestionId={lastQuestionId}
            question={lastSubmittedQuestion}
            answer={answer}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
