import { Typography, TextField, Button, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import { useFormik } from "formik";
import * as yup from "yup";
import { AuthProps } from ".";
import { bannerAtom, useAtom } from "../../components/Banner";
import { register } from "../../requests/user";
import validator from "validator";

const validationSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .test("is-phone-number", "Invalid phone number", (value) =>
      validator.isMobilePhone(value || "")
    ),
});

const RegistrationPage = (props: AuthProps) => {
  const [, setBanner] = useAtom(bannerAtom);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      remember: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      register(values)
        .then((res) => {
          setBanner({
            severity: "success",
            message: "Registration successful!",
          });
          setTimeout(() => {
            setBanner({ severity: "success", message: "" });
            props.onSubmit(res.data);
          }, 400);
        })
        .catch((err) => {
          setBanner({
            severity: "error",
            message: err.response.data.message || err.response.data.msg,
          });
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <div>
      <form style={{ marginTop: "60px" }} onSubmit={formik.handleSubmit}>
        <Typography align="center" gutterBottom={true} variant={"h4"}>
          Register
        </Typography>
        <div style={{ marginTop: "10px" }}></div>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          autoComplete="off"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <div style={{ marginTop: "10px" }}></div>
        <TextField
          fullWidth
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          autoComplete="off"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          error={
            formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
          }
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        />
        <div style={{ marginTop: "10px" }}></div>
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="off"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <div style={{ marginTop: "10px" }}></div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.remember}
                value={formik.values.remember}
                onChange={formik.handleChange}
                size="small"
                id="remember"
                name="remember"
              />
            }
            label="Remember Me"
          />
          <Link
            className="link"
            color="inherit"
            onClick={() => {
              props.switchPage();
            }}
          >
            Have an account? Login here
          </Link>
        </Box>
        <div style={{ marginTop: "10px" }}></div>
        <Box m={5}>
          <Button
            disabled={formik.isSubmitting}
            variant="contained"
            fullWidth
            type="submit"
          >
            {formik.isSubmitting ? <CircularProgress /> : "Submit"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default RegistrationPage;
