import React, { useEffect, useState } from "react";
import { TextField, Button, Grid, Box, FormHelperText } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import _ from "lodash";

interface Question {
  question: string;
  answerChoices: string[];
}

interface MultipleChoiceProps {
  formik: any;
}

const MultipleChoiceForm = (props: MultipleChoiceProps) => {
  const [question, setQuestion] = useState<Question>({
    question: "",
    answerChoices: ["", "", "", ""],
  });

  const addAnswer = () => {
    setQuestion({
      ...question,
      answerChoices: [...question.answerChoices, ""],
    });
  };

  const deleteAnswer = (index: number) => {
    const updatedanswerChoices = [...question.answerChoices];
    updatedanswerChoices.splice(index, 1);
    setQuestion({ ...question, answerChoices: updatedanswerChoices });
  };

  useEffect(() => {
    if (
      JSON.stringify(question) === JSON.stringify(props.formik.values.question)
    ) {
      return;
    }
    props.formik.setFieldValue("question", question, false);
  }, [question, props.formik]);

  const questionError = _.get(props.formik.errors, "question.question");
  const answerError = _.get(props.formik.errors, `question.answerChoices`);

  return (
    <div>
      <div>
        <TextField
          fullWidth
          error={Boolean(questionError)}
          helperText={questionError}
          multiline
          label="Question"
          name="question"
          placeholder="Enter your question here"
          margin="dense"
          value={question.question}
          onChange={(event) => {
            const updatedQuestion = { ...question };
            updatedQuestion.question = event.target.value;
            setQuestion(updatedQuestion);
          }}
        />
        <Box my={2}></Box>
        {question.answerChoices.map((answer, aIndex) => {
          return (
            <Grid key={aIndex} container justifyContent={"end"}>
              <Grid item xs={12}>
                <TextField
                  error={Boolean(answerError)}
                  helperText={answerError}
                  key={aIndex}
                  fullWidth
                  type="text"
                  multiline
                  name={`answerChoices[${aIndex}]`}
                  label={`Answer ${aIndex + 1}`}
                  value={answer}
                  onChange={(event) => {
                    const updatedQuestion = { ...question };
                    updatedQuestion.answerChoices[aIndex] = event.target.value;
                    setQuestion(updatedQuestion);
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <RemoveIcon onClick={() => deleteAnswer(aIndex)} />
              </Grid>
            </Grid>
          );
        })}
      </div>

      <Button fullWidth onClick={addAnswer}>
        Add Answer
      </Button>
    </div>
  );
};

export default MultipleChoiceForm;
