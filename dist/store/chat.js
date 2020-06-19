import { atom } from "recoil";
export const chatWindowState = atom({
    key: "chatWindowState",
    default: [],
});
export const chatWelcomeMessageState = atom({
    key: "chatWelcomeMessageState",
    default: "",
});
export const chatUserIsTypingState = atom({
    key: "chatUserIsTypingState",
    default: false,
});
