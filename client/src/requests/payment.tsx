import axios from "axios";

export const getPaymentIntent = async () => axios.get(`/api/payment/intent`);

export const submitPayment = async (data: any) =>
  axios.post(`/api/payment/submit`, data);
