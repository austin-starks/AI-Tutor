import { Box, Grid, Link, TextField, Typography } from "@mui/material";
import React from "react";

interface AdvancedSearchProps {
  formik: any;
}

const AdvancedSearch = (props: AdvancedSearchProps) => {
  const { formik } = props;
  const [show, setShow] = React.useState(false);
  return (
    <>
      <Box
        onClick={() => setShow((s) => !s)}
        sx={{
          textAlign: "end",
          color: "#1664c0",
        }}
      >
        <Typography
          sx={{
            "&:hover": {
              cursor: "pointer",
              textDecoration: "underline",
            },
          }}
          variant="caption"
        >
          {show ? "Hide" : "Show"} Advanced Search
        </Typography>
      </Box>
      <Grid my={2} item xs={12} md={12}>
        {show && (
          <>
            <TextField
              placeholder={`The more context you give the model about the question, the better the answer. For example, "This is a question on a past AP Chemistry exam. We studied this on Chapter 7 of "Chemistry and their Reactions" textbook by Tom Ruttledge."`}
              error={Boolean(formik.errors["context"])}
              helperText={formik.errors["context"]}
              fullWidth
              label={"Additional Context"}
              multiline
              variant="outlined"
              id={"context"}
              name={"context"}
              value={formik.values["context"]}
              onChange={(e) => {
                formik.setFieldValue(`context`, e.target.value, false);
              }}
            />
          </>
        )}
      </Grid>
    </>
  );
};

export default AdvancedSearch;
