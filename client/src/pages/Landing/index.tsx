import { useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { landingPageStyle } from "./styles";
import { Slide } from "react-awesome-reveal";
import { countUniqueUsers, countCallToAction } from "../../requests/event";
import { useNavigate, useSearchParams } from "react-router-dom";

const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref") || "";
  useEffect(() => {
    countUniqueUsers({ ref });
  }, []);

  const navigate = useNavigate();

  const navigateTo = async (path: string, id: number) => {
    countCallToAction({ id, ref });
    navigate(path);
  };

  return (
    <div>
      <Slide direction="down">
        <section style={landingPageStyle.jumbotron}>
          <Grid
            justifyContent={"space-between"}
            alignItems="center"
            display="flex"
            container
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h3">
                Unlock Your Full Potential with StarkTech Tutor
              </Typography>
              <Typography variant="h6">
                Revolutionize the way you do homework with instant answers,
                comprehensive coverage, and learning AI technology.
              </Typography>
              <Box my={3}></Box>
              <Button
                onClick={() => {
                  navigateTo("/app", 0);
                }}
                variant="contained"
              >
                Try for Free
              </Button>
            </Grid>
            <Grid my={2} item xs={12} md={6}>
              <Box>
                <img
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  src="img/example.gif"
                />
              </Box>
            </Grid>
          </Grid>
        </section>
      </Slide>
      <Slide direction="left">
        <section style={landingPageStyle.section}>
          <Grid
            mb={3}
            justifyContent={"space-between"}
            display="flex"
            container
          >
            <Grid my={2} item xs={12} md={6}>
              <Box mx={2}>
                <img
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                  src="img/answer.png"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box textAlign={"center"} my={4}>
                <Typography variant="h4">
                  Never get stuck on a homework problem again
                </Typography>
              </Box>
              <Typography variant="h6">
                Our state-of-the-art technology is designed to help students of
                all ages, from elementary school to university, with their
                homework and studying needs. Unlike other homework help sites,
                our tool is faster and more accurate, providing students with
                the answers they need in seconds. Plus, our AI technology learns
                as it is used, ensuring that the answers it provides are always
                up-to-date and relevant. Try it now by clicking the button
                below!
              </Typography>
              <Box mt={3} textAlign={"center"}>
                <Button
                  onClick={() => {
                    navigateTo("/app", 1);
                  }}
                  variant="contained"
                >
                  Try for Free
                </Button>
              </Box>
            </Grid>
          </Grid>
        </section>
      </Slide>
      <Slide direction="right">
        <Grid
          mb={3}
          justifyContent={"space-between"}
          alignItems="start"
          display="flex"
          container
        >
          <Grid item xs={12} md={6}>
            <Box my={4}>
              <section style={landingPageStyle.section}>
                <Typography variant="h4">Features:</Typography>
                <ul style={landingPageStyle.list}>
                  <li style={landingPageStyle.listItem}>
                    Instant answers to homework questions
                  </li>
                  <li style={landingPageStyle.listItem}>
                    Coverage of common elementary school, middle school, high
                    school and university courses
                  </li>
                  <li style={landingPageStyle.listItem}>
                    Learning as it is used, ensuring answers are always
                    up-to-date and relevant
                  </li>
                  <li style={landingPageStyle.listItem}>
                    An easy-to-use interface that is accessible from any device
                    with internet access
                  </li>
                  <li style={landingPageStyle.listItem}>
                    A great alternative to Chegg, which can be slow and
                    unreliable
                  </li>
                </ul>
              </section>
            </Box>
          </Grid>
          <Grid my={2} item xs={12} md={6}>
            <Box mx={2}>
              <img
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                src="img/form.png"
              />
            </Box>
          </Grid>
        </Grid>
      </Slide>
      <Slide direction="left">
        <section style={landingPageStyle.section}>
          <Typography variant="h4">Try it Now</Typography>
          <Box my={2}></Box>
          <Typography variant="h6">
            Don't waste any more time struggling with your homework. Try out
            StarkTech Tutor today and see the difference it can make in your
            studies. With instant answers, coverage of common courses, and a
            learning AI technology, our tool is the perfect solution for
            students of all ages. Sign up now and start getting the answers you
            need to succeed!
          </Typography>
          <Box mt={3} textAlign={"center"}>
            <Button
              onClick={() => {
                navigateTo("/app", 2);
              }}
              variant="contained"
            >
              Try for Free
            </Button>
          </Box>
        </section>
      </Slide>
    </div>
  );
};

export default LandingPage;
