import axios from "axios";

export const countUniqueUsers = () => axios.post(`/api/event/uniqueUsers`);
export const countCallToAction = (id: number) =>
  axios.post(`/api/event/callToAction`, { id });
