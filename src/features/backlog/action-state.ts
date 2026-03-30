export type BacklogActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialBacklogActionState: BacklogActionState = {
  status: "idle",
  message: "",
};
