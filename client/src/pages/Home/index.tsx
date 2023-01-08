import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { balanceAtom } from "../../components/Balance";
import Banner, { bannerAtom, useAtom } from "../../components/Banner";
import { modalAtom } from "../../components/Modal";
import { catchServerError } from "../../requests/common";
import {
  ask,
  getQuestionCostsAndBalance,
  QuestionCost,
  QuestionRequest,
} from "../../requests/question";
import AnswerBox from "./AnswerBox";
import QuestionBox from "./QuestionBox";

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
    getQuestionCostsAndBalance()
      .then((res) => {
        setCosts(res.data.costs);
        setBalance(res.data.balance);
      })
      .catch((err) => catchServerError(err, setModalType, setBanner));
  }, []);

  return (
    <Box margin="1.5rem auto" width={"80%"}>
      <Banner banner={banner} handleClose={handleClose} />
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