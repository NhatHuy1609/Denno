import type { EntityType } from "@/service/api/_constants/entity-types";
import type { IconType } from "react-icons/lib";
import { EntityTypeSchema as EntityTypes } from "@/service/api/_constants/entity-types";
import { 
  FaUserFriends,
  FaUser, 
  FaList, 
  FaCreditCard, 
  FaUserPlus, 
  FaUserCheck 
} from "react-icons/fa";
import { HiViewBoards } from "react-icons/hi";
import { MdOutlinePersonAddAlt } from "react-icons/md";

export const EntityIcons: Record<EntityType, IconType> = {
  [EntityTypes.Enum.user]: FaUser,
  [EntityTypes.Enum.workspace]: FaUserFriends,
  [EntityTypes.Enum.board]: HiViewBoards,
  [EntityTypes.Enum.cardList]: FaList,
  [EntityTypes.Enum.card]: FaCreditCard,
  [EntityTypes.Enum.memberCreator]: FaUserPlus,
  [EntityTypes.Enum.addedMember]: MdOutlinePersonAddAlt,
  [EntityTypes.Enum.joinedMember]: FaUserCheck,
  [EntityTypes.Enum.requester]: FaUser
}

export function getEntityIcon(entityType: EntityType): IconType {
  return EntityIcons[entityType]
}
