import { Route, Routes } from "react-router-dom";
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

  return (
    <>
      <Header />
      <Box sx={{ margin: "0 auto", maxWidth: "3000px" }}>
        <Elements stripe={stripePromise}>
          <Styles />
          <Modal open={modalType !== ""} handleClose={() => setModalType("")}>
            {modalType === ModalType.Authentication && (
              <AuthenticationPage
                onSubmit={(obj) => {
                  setModalType("");
                  setBalance(obj.balance);
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
      <Routes>
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
