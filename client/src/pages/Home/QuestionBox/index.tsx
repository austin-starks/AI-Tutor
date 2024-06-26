import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {
  QuestionCost,
  QuestionRequest,
  QuestionTypeEnum,
  SubjectEnum,
} from "../../../requests/question";
import * as yup from "yup";
import { useFormik } from "formik";
import RenderQuestion from "./RenderQuestion";
import Cookies from "js-cookie";
import _ from "lodash";
import AdvancedSearch from "./AdvancedSearch";

interface QuestionBoxProps {
  onSubmit: (question: QuestionRequest) => void;
  costs: QuestionCost | null;
  balance?: number;
}

const validationSchema = yup.object({
  questionType: yup.string().required("The question type is required"),
  question: yup
    .object()
    .when("questionType", {
      is: QuestionTypeEnum.OTHER,
      then: yup.object().shape({
        question: yup.string().required("The question is required"),
      }),
    })
    .when("questionType", {
      is: QuestionTypeEnum.FillInTheBlank,
      then: yup.object().shape({
        statement: yup.string().required("The statement is required"),
      }),
    })
    .when("questionType", {
      is: QuestionTypeEnum.Essay,
      then: yup.object().shape({
        prompt: yup.string().required("The prompt is required"),
        wordMin: yup.number(),
        wordMax: yup.number(),
      }),
    })
    .when("questionType", {
      is: QuestionTypeEnum.ShortAnswer,
      then: yup.object().shape({
        question: yup.string().required("The question is required"),
      }),
    })
    .when("questionType", {
      is: QuestionTypeEnum.MultipleChoice,
      then: yup.object().shape({
        question: yup.string().required("The question is required"),
        answerChoices: yup
          .array()
          .of(yup.string().required("The answer choice is required"))
          .min(2, "Must have at least 2 answer choices"),
      }),
    }),
});

const QuestionBox = (props: QuestionBoxProps) => {
  const formik = useFormik({
    initialValues: {
      context: "",
      subject: SubjectEnum.GENERAL,
      question: "" as any,
      questionType: QuestionTypeEnum.ShortAnswer,
    },
    validationSchema: validationSchema,
    onSubmit: props.onSubmit,
  });
  return (
    <form className="question-answer-container" onSubmit={formik.handleSubmit}>
      <Grid
        display="flex"
        justifyContent={"space-between"}
        rowGap={3}
        columnGap={1}
        container
      >
        <Grid item xs={12} md={5.5}>
          <FormControl
            fullWidth
            error={
              formik.touched["subject"] && Boolean(formik.errors["subject"])
            }
          >
            <InputLabel id={`${"Subject"}-label`}>{"Subject"}</InputLabel>
            <Select
              labelId={`${"Subject"}-label`}
              id={"subject"}
              name={"subject"}
              value={formik.values["subject"]}
              label={"Subject"}
              onChange={(e) => {
                formik.setFieldValue("subject", e.target.value, false);
                formik.setErrors({});
              }}
            >
              {Object.values(SubjectEnum).map((o) => (
                <MenuItem key={o} value={o}>
                  {o}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formik.errors["subject"]}</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={5.5}>
          <FormControl
            fullWidth
            error={
              formik.touched["questionType"] &&
              Boolean(formik.errors["questionType"])
            }
          >
            <InputLabel id={`${"Question Type"}-label`}>
              {"Question Type"}
            </InputLabel>
            <Select
              labelId={`${"Question Type"}-label`}
              id={"questionType"}
              name={"questionType"}
              value={formik.values["questionType"]}
              label={"Question Type"}
              onChange={(e) => {
                formik.setFieldValue("questionType", e.target.value, false);
                formik.setFieldValue("question", "", false);
                formik.setErrors({});
              }}
            >
              {Object.values(QuestionTypeEnum).map((o) => (
                <MenuItem key={o} value={o}>
                  {o} ({props.costs?.[o] || 0} coins)
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formik.errors["questionType"]}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <RenderQuestion formik={formik} />
        </Grid>
      </Grid>
      <AdvancedSearch formik={formik} />
      <Grid container display={"flex"} justifyContent="space-between">
        <Grid margin={"0 auto"} textAlign="center" item mb={2} xs={12} sm={3}>
          {formik.isSubmitting ? (
            <CircularProgress />
          ) : (
            <Button
              fullWidth
              disabled={formik.isSubmitting}
              variant="contained"
              type="submit"
            >
              {"Submit"}
            </Button>
          )}
        </Grid>
        {Cookies.get("jwt") && !_.isNil(props.balance) && (
          <Grid margin={"0 auto"} textAlign="center" item xs={6} sm={3}>
            <Typography variant="body2">
              Balance: {props.balance} Coins
            </Typography>
          </Grid>
        )}
        <Grid margin={"0 auto"} textAlign="center" item xs={6} sm={3}>
          <Typography variant="body2">
            Cost: {props.costs && props.costs[formik.values["questionType"]]}{" "}
            Coins
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
};

export default QuestionBox;
