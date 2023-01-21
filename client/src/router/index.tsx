import { Route, Routes, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Styles } from "../styles/styles";
import { atom } from "jotai";
import Banner, { useAtom } from "../components/Banner";
import Home from "../pages/Home";
import Modal, { modalAtom, ModalType } from "../components/Modal";
import AuthenticationPage from "../pages/Authentication";
import Stripe from "../components/Payment/Stripe";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Box } from "@mui/system";
import Referral from "../components/Referral";
import { balanceAtom } from "../components/Balance";
import LandingPage from "../pages/Landing";
import { useEffect } from "react";
import { countUniqueUsers } from "../requests/event";

const stripePromise = loadStripe(
  "pk_test_51MNQuuLGasFw47mVwXPigNgzMK5W1IfVuUKqfnoyXztXOYj5KKQgLp2QD40kiwVwNF3Tf0EY2oXLbjwab8zajkMz00wkoxROsM"
);

export const bannerAtom = atom<{
  message: string;
  severity: "error" | "success";
}>({
  message: "",
  severity: "error",
});

const Wrapper = (props: { children: React.ReactNode }) => {
  const [modalType, setModalType] = useAtom(modalAtom);
  const [banner, setBanner] = useAtom(bannerAtom);
  const handleClose = () => {
    setBanner((b) => ({ ...b, message: "" }));
  };
  const [, setBalance] = useAtom(balanceAtom);
  const [searchParams] = useSearchParams();
  const refLink = searchParams.get("ref");
  const refCode = searchParams.get("referralCode");
  useEffect(() => {
    countUniqueUsers({ ref: refLink });
  }, []);
  useEffect(() => {
    if (refCode) {
      setModalType(ModalType.Authentication);
    }
  }, []);
  return (
    <>
      <Header />
      <Box sx={{ margin: "0 auto", maxWidth: "3000px" }}>
        <Elements stripe={stripePromise}>
          <Modal open={modalType !== ""} handleClose={() => setModalType("")}>
            {modalType === ModalType.Authentication && (
              <AuthenticationPage
                onSubmit={(obj) => {
                  setModalType("");
                  setBalance(obj.balance);
                  searchParams.set("referralCode", "");
                }}
              />
            )}
            {modalType === ModalType.Payment && (
              <Stripe
                onPaymentSuccess={(obj) => {
                  setModalType("");
                  setBanner({
                    message: "Payment successful",
                    severity: "success",
                  });
                  setBalance(obj.balance);
                }}
              />
            )}
            {modalType === ModalType.Referral && (
              <Referral
                onSuccess={() => {
                  setModalType("");
                  setBanner({
                    message: "Payment successful",
                    severity: "success",
                  });
                }}
              />
            )}
          </Modal>
          <Banner banner={banner} handleClose={handleClose} />
          {props.children}
          <Footer />
        </Elements>
      </Box>
    </>
  );
};

const Router = () => {
  return (
    <Elements stripe={stripePromise}>
      <Styles />
      <Routes>
        <Route
          path={"/landing"}
          element={
            <Wrapper>
              <LandingPage />
            </Wrapper>
          }
        />
        <Route
          path={"/"}
          element={
            <Wrapper>
              <Home />
            </Wrapper>
          }
        />
      </Routes>
      <Footer />
    </Elements>
  );
};

export default Router;
