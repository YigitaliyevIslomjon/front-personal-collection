import { toast } from "react-toastify";

type PositionType =
  | "top-right"
  | "top-center"
  | "top-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left";

type TostType = "info" | "success" | "warn" | "error";
type ThemeType = "light" | "dark" | "colored";
export let toastifyMessage = ({
  type = "success",
  message = "successfully",
  theme = "light",
  time = 3000,
  position = "top-right",
}: {
  message?: string;
  position?: PositionType;
  time?: number;
  type?: TostType;
  theme?: ThemeType;
}) => {
  return toast[type](message, {
    position: position,
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme,
  });
};
