import { BoardVisibilityEnum } from "@/service/api/_enums/enums.types";

const boardVisibilityDescriptions: { [key in BoardVisibilityEnum]: string } = {
  Private : "Only board members can see this board. Workspace admins can close the board or remove members.",
  Workspace : "All members of the workspace can see and edit this board.",
  Public: "Anyone on the internet can see this board. Only board members can edit.",
};

export { boardVisibilityDescriptions }