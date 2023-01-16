import axios from "axios";

interface EventMetadata {
  id?: number;
  ref: string | null;
}

export const countUniqueUsers = (metadata: EventMetadata) =>
  axios.post(`/api/event/uniqueUsers`, metadata);
export const countCallToAction = (metadata: EventMetadata) =>
  axios.post(`/api/event/callToAction`, metadata);
