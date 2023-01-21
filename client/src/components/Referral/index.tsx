import { Box, Link, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { catchServerError } from "../../requests/common";
import { getReferralCode } from "../../requests/user";
import { bannerAtom } from "../Banner";
import { modalAtom } from "../Modal";

interface ReferralProps {
  onSuccess: () => void;
}

const Referral = (props: ReferralProps) => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [, setModalType] = useAtom(modalAtom);
  const [, setBanner] = useAtom(bannerAtom);
  useEffect(() => {
    getReferralCode()
      .then((res) => {
        setReferralCode(res.data.referralCode);
      })
      .catch((err) => catchServerError(err, setModalType, setBanner));
  }, []);
  const referralLink = `${window.location.origin}?referralCode=${referralCode}`;
  return (
    <Box>
      <Box>
        <Typography textAlign={"center"} variant="h3">
          Referral Code:
        </Typography>
        <Typography textAlign={"center"} variant="h5">
          {referralCode}
        </Typography>
        <Typography textAlign={"center"} variant="h5">
          Click the below link to copy it to your clipboard:
        </Typography>
        <Typography
          onClick={() => {
            navigator.clipboard.writeText(referralLink);
            setBanner({
              severity: "success",
              message: "Copied referral link to clipboard!",
            });
          }}
          sx={{
            cursor: "pointer",
            color: "#3f51b5",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          textAlign={"center"}
          variant="h4"
        >
          {referralLink}
        </Typography>
      </Box>
      <Box>
        <Typography textAlign={"center"} variant="h5">
          If your friend signs up with your referral code, BOTH of you will earn
          100 coins!
        </Typography>
      </Box>
    </Box>
  );
};
export default Referral;
