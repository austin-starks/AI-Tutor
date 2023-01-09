import { Typography, TextField, Button, CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import { useFormik } from "formik";
import * as yup from "yup";
import { AuthProps } from ".";
import { bannerAtom, useAtom } from "../../components/Banner";
import { login } from "../../requests/user";

const validationSchema = yup.object({
  emailOrPhone: yup.string().required("Email or phone number is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const RegistrationPage = (props: AuthProps) => {
  const [, setBanner] = useAtom(bannerAtom);
  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
      password: "",
      remember: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      login(values)
        .then((res) => {
          setBanner({ severity: "success", message: "Login successful!" });
          setTimeout(() => {
            setBanner((b) => ({ ...b, message: "" }));
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
      <form style={{ marginTop: "100px" }} onSubmit={formik.handleSubmit}>
        <Typography align="center" gutterBottom={true} variant={"h4"}>
          Login
        </Typography>
        <TextField
          fullWidth
          id="email"
          name="emailOrPhone"
          label="Email or Phone Number"
          value={formik.values.emailOrPhone}
          onChange={formik.handleChange}
          error={
            formik.touched.emailOrPhone && Boolean(formik.errors.emailOrPhone)
          }
          helperText={formik.touched.emailOrPhone && formik.errors.emailOrPhone}
        />
        <div style={{ marginTop: "10px" }}></div>
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
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
            Don't have an account? Register here
          </Link>
        </Box>
        <div style={{ marginTop: "5px" }}></div>
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
