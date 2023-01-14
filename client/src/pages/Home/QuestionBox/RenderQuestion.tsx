import { Box, TextField } from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import { QuestionTypeEnum } from "../../../requests/question";
import MultipleChoice from "./MultipleChoice";

const RenderQuestion = (props: { formik: any }) => {
  const { formik } = props;
  const questionType: QuestionTypeEnum = formik.values.questionType;
  const [fields, setFields] = useState<
    {
      name: string;
      label: string;
      placeholder?: string;
      type: "text" | "number";
    }[]
  >([]);

  useEffect(() => {
    if (questionType === QuestionTypeEnum.FillInTheBlank) {
      setFields([
        {
          label: "Statement",
          name: "statement",
          placeholder:
            "For example: the most abundant element in the universe is _.",
          type: "text",
        },
      ]);
    }
    if (questionType === QuestionTypeEnum.Essay) {
      setFields([
        {
          label: "Prompt",
          name: "prompt",
          placeholder: "What the essay is about (in great detail)",
          type: "text",
        },
        // {
        //   label: "Minimum Essay Length",
        //   name: "wordMin",
        //   type: "number",
        //   placeholder: "The minimum words in the essay",
        // },
        // {
        //   label: "Maximum Essay Length",
        //   name: "wordMax",
        //   type: "number",
        //   placeholder: "The maximum words in the essay",
        // },
      ]);
    }
    if (questionType === QuestionTypeEnum.OTHER) {
      setFields([
        {
          label: "Question",
          name: "question",
          placeholder:
            "Be specfic with what you want. For example, if you want to summarize a book, type \"Summarize each chapter in 'Harry Potter and the Goblet of Fire'.\" If you want to translate a sentence from English to Latin, type \"Translate the following sentence from English to Latin: 'Edward found Emily and gave her 10 apples.'\"",
          type: "text",
        },
      ]);
    }
    if (questionType === QuestionTypeEnum.ShortAnswer) {
      setFields([
        {
          label: "Question",
          name: "question",
          placeholder:
            'Questions like, "Who was the president of the United States in 2005?"',
          type: "text",
        },
      ]);
    }
    formik.setFieldValue("question.question", "", false);
    formik.setFieldValue("question.prompt", "", false);
  }, [questionType]);

  if (questionType === QuestionTypeEnum.MultipleChoice) {
    return <MultipleChoice formik={formik} />;
  }
  return (
    <>
      {fields.map((field, idx) => {
        const error = _.get(formik.errors, `question.${field.name}`);
        return (
          <Box key={idx} mb={3}>
            <TextField
              type={field.type || "text"}
              placeholder={field.placeholder}
              error={Boolean(error)}
              helperText={error}
              fullWidth
              label={field.label}
              multiline={field.type !== "number"}
              variant="outlined"
              minRows={5}
              id={field.name}
              name={field.name}
              value={formik.values["question"][field.name]}
              onChange={(e) => {
                formik.setFieldValue(
                  `question.${field.name}`,
                  e.target.value,
                  false
                );
              }}
            />
          </Box>
        );
      })}
    </>
  );
};

export default RenderQuestion;
