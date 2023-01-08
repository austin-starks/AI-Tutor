import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {
  QuestionRequest,
  submitQuestionFeedback,
} from "../../../requests/question";
import { useAtom } from "jotai";
import { bannerAtom } from "../../../router";
import { catchServerError } from "../../../requests/common";
import { modalAtom } from "../../../components/Modal";

interface AnswerBoxProps {
  answer: string;
  question: QuestionRequest | null;
  lastQuestionId: string;
}

const AnswerBox = (props: AnswerBoxProps) => {
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [, setModalType] = useAtom(modalAtom);
  const [, setBanner] = useAtom(bannerAtom);
  const submitFeedback = (feedback: "good" | "bad") => {
    if (!props.question) {
      setBanner({
        message: "You can only submit feedback after submitting a question.",
        severity: "error",
      });
      return;
    }
    submitQuestionFeedback(
      props.lastQuestionId,
      props.question,
      answer,
      feedback
    )
      .then(() => {
        setBanner({
          message: "Thank you for your feedback!",
          severity: "success",
        });
      })
      .catch((err) => catchServerError(err, setModalType, setBanner));
  };

  useEffect(() => {
    setAnswer(props.answer);
    if (props.answer) {
      setHasSubmitted(true);
    }
  }, [props.answer]);

  return (
    <Box
      sx={{ backgroundColor: "#F1F2F3" }}
      className="question-answer-container"
    >
      <div>
        {props.question && (
          <Box display="flex" justifyContent="space-between" gap={2} mb={1}>
            <Box sx={{ "&:hover": { cursor: "pointer" }, color: "black" }}>
              <ThumbUpIcon
                onClick={() => {
                  submitFeedback("good");
                }}
              />
            </Box>
            <Box sx={{ "&:hover": { cursor: "pointer" }, color: "black" }}>
              <ThumbDownIcon
                onClick={() => {
                  submitFeedback("bad");
                }}
              />
            </Box>
          </Box>
        )}
        <Box className={answer ? "typist" : ""}>
          <Typography variant="body1">
            {!hasSubmitted ? "Click Submit to Generate the Answer" : answer}
          </Typography>
        </Box>
      </div>
    </Box>
  );
};
export default AnswerBox;
