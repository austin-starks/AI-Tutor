import { Box, Typography } from "@mui/material";

interface ReferralProps {
  onSuccess: () => void;
}

const Referral = (props: ReferralProps) => {
  return (
    <Box>
      <Box>
        <Typography textAlign={"center"} variant="h3">
          Coming soon!
        </Typography>
      </Box>
      <Box>
        <Typography textAlign={"center"} variant="h6">
          A way to earn free coins by referring your friends!
        </Typography>
      </Box>
    </Box>
  );
};
export default Referral;
