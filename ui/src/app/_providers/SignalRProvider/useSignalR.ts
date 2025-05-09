import { SignalRContext } from "./SignalRProvider";
import { useContext } from "react";

export const useSignalR = () => useContext(SignalRContext)