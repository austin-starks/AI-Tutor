import { ModalType } from "../components/Modal";

export function catchServerError(
  err: any,
  setModalType: (modalType: ModalType) => void,
  setBanner: (banner: {
    message: string;
    severity: "error" | "success";
  }) => void
): any {
  if (err.response.status === 401 || err.response.status === 403) {
    setModalType(ModalType.Authentication);
    return;
  }
  if (
    err.response.data.msg === "Insufficient balance" ||
    err.response.status === 402
  ) {
    setModalType(ModalType.Payment);
    return;
  }

  setBanner({
    message: err.response.data.msg,
    severity: "error",
  });
}
