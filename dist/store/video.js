import { atom, selector } from "recoil";
import { listUsersState } from "./users";
export const streamState = atom({
    key: "streamState",
    default: null,
});
export const receivingCallState = atom({
    key: "receivingCallState",
    default: false,
});
export const callerState = atom({
    key: "callerState",
    default: null,
});
export const callerSignalState = atom({
    key: "callerSignalState",
    default: null,
});
export const callAcceptedState = atom({
    key: "callAcceptedState",
    default: false,
});
export const cancelCallRequestState = atom({
    key: "cancelCallRequest",
    default: false,
});
export const showSelfWebcamState = atom({
    key: "showSelfWebcamState",
    default: true,
});
export const muteMicState = atom({
    key: "muteMicState",
    default: false,
});
export const pressedCallState = atom({
    key: "pressedCallState",
    default: false,
});
export const disableCallIconState = selector({
    key: "disableCallIconState",
    get: ({ get }) => {
        const receivingCall = get(receivingCallState);
        // const cancelCall = get(cancelCallRequestState)
        const listUsers = get(listUsersState);
        console.log("RECEIVING", receivingCall);
        if (listUsers?.length < 2) {
            return true;
        }
        else {
            return false;
        }
    },
});
