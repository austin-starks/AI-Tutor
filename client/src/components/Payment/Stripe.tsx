import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { submitPayment } from "../../requests/payment";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { bannerAtom } from "../Banner";
import React from "react";
import { Link } from "react-router-dom";
import { modalAtom, ModalType } from "../Modal";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

const CoinCard = (props: {
  amount: number;
  cost: string;
  onClick: () => void;
  isSelected: boolean;
  subtitle?: string;
}) => {
  return (
    <Box
      onClick={props.onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          backgroundColor: "black",
          color: "white",
        },
        p: 2,
        color: props.isSelected ? "white" : undefined,
        backgroundColor: props.isSelected ? "black" : undefined,
        borderRadius: 1,
        cursor: "pointer",
      }}
    >
      <Box>
        <Typography variant="body2">{props.cost}</Typography>
      </Box>

      <Box
        sx={{
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        {props.amount}
      </Box>
      <Box
        sx={{
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        Coins
      </Box>
    </Box>
  );
};

interface CheckoutFormProps {
  onPaymentSuccess: (obj: { balance: number }) => void;
}

function CheckoutForm(props: CheckoutFormProps) {
  const [, setBanner] = useAtom(bannerAtom);
  const [, setModalType] = useAtom(modalAtom);

  const [selected, setSelected] = React.useState<
    { cost: string; amount: number } | undefined
  >();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!selected) {
      setBanner({
        severity: "error",
        message: "Select the amount of coins you want to purchase",
      });
      setIsSubmitting(false);
      return;
    }

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error || !paymentMethod) {
      setBanner({
        severity: "error",
        message: error.message || "An error occurred",
      });
      setIsSubmitting(false);
      return;
    }
    const { id } = paymentMethod;
    await submitPayment({ id, amount: selected?.amount || 0 })
      .then((res) => {
        if (res.data.success) {
          props.onPaymentSuccess({ balance: res.data.balance });
        }
      })
      .catch(() => {
        setBanner({
          severity: "error",
          message: "An error occurred while submitting the payment",
        });
      });
    setIsSubmitting(false);
  };

  return (
    <Box>
      <Box my={2} textAlign="center">
        <Typography variant="h3">Buy More Tokens</Typography>
        <Typography variant="h6">
          {" "}
          Select an option below to purchase more
        </Typography>
      </Box>
      <Box my={2} textAlign="center">
        <Typography variant="h4"> {selected?.cost}</Typography>
        <Typography variant="body1">
          {" "}
          {selected?.amount === 50
            ? "Good value"
            : selected?.amount === 200
            ? "Great value!"
            : !selected
            ? ""
            : "Best value!"}
        </Typography>
      </Box>
      <Grid
        sx={{ backgroundColor: "lightgrey", borderRadius: "15px" }}
        textAlign={"center"}
        container
      >
        <Grid item xs={4}>
          <CoinCard
            amount={50}
            cost="$25.00"
            onClick={() => {
              setSelected({ cost: "$25.00", amount: 50 });
            }}
            isSelected={selected?.amount === 50}
          />
        </Grid>
        <Grid item xs={4}>
          <CoinCard
            amount={200}
            cost="$50.00"
            onClick={() => {
              setSelected({ cost: "$50.00", amount: 200 });
            }}
            isSelected={selected?.amount === 200}
          />
        </Grid>
        <Grid item xs={4}>
          <CoinCard
            cost="$100.00"
            amount={800}
            onClick={() => {
              setSelected({ cost: "$100.00", amount: 800 });
            }}
            isSelected={selected?.amount === 800}
          />
        </Grid>
      </Grid>
      <Box my={2} textAlign="center"></Box>

      <Box textAlign="center">
        <form onSubmit={handleSubmit}>
          <fieldset className="StripeFormGroup">
            <div className="StripeFormRow">
              <CardElement options={CARD_OPTIONS as any} />
            </div>
          </fieldset>
          <Box mt={3} margin="0 auto" width={"80%"}>
            <Button
              disabled={isSubmitting}
              fullWidth
              variant="contained"
              type="submit"
            >
              {!isSubmitting ? (
                "Submit Payment"
              ) : (
                <CircularProgress color="inherit" />
              )}
            </Button>
          </Box>
        </form>
      </Box>
      <Typography
        variant="h5"
        sx={{
          mt: 2,
          textAlign: "center",
          textDecoration: "underline",
          color: "primary.main",
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={() => {
          setModalType(ModalType.Referral);
        }}
      >
        Or refer a friend instead
      </Typography>
    </Box>
  );
}

export default CheckoutForm;
