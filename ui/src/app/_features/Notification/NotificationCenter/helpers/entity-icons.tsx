import type { EntityType } from '@/service/api/_constants/entity-types'
import type { IconType } from 'react-icons/lib'
import { EntityTypeSchema as EntityTypes } from '@/service/api/_constants/entity-types'

import {
  FaUserFriends,
  FaUser,
  FaList,
  FaCreditCard,
  FaUserPlus,
  FaUserCheck,
  FaUserEdit,
  FaUserMinus,
  FaUserShield
} from 'react-icons/fa'
import { HiViewBoards } from 'react-icons/hi'
import { MdOutlinePersonAddAlt } from 'react-icons/md'
import Image from 'next/image'
import { ReactNode } from 'react'

export const EntityIcons: Partial<Record<EntityType, ReactNode>> = {
  [EntityTypes.Enum.user]: <FaUser className='text-xl' />,
  [EntityTypes.Enum.workspace]: <FaUserFriends className='text-xl' />,
  [EntityTypes.Enum.cardList]: <FaList className='text-xl' />,
  [EntityTypes.Enum.card]: <FaCreditCard className='text-xl' />,
  [EntityTypes.Enum.memberRole]: <FaUserShield className='text-xl' />,
  [EntityTypes.Enum.memberCreator]: <FaUserPlus className='text-xl' />,
  [EntityTypes.Enum.addedMember]: <MdOutlinePersonAddAlt className='text-xl' />,
  [EntityTypes.Enum.joinedMember]: <FaUserCheck className='text-xl' />,
  [EntityTypes.Enum.requester]: <FaUser className='text-xl' />,
  [EntityTypes.Enum.updatedMember]: <FaUserEdit className='text-xl' />,
  [EntityTypes.Enum.removedMember]: <FaUserMinus className='text-xl' />,
  [EntityTypes.Enum.removedGuest]: <FaUserMinus className='text-xl' />
}

export function getEntityIcon(type: EntityType, imageUrl?: string): ReactNode {
  if (type === 'board' && imageUrl) {
    return <Image src={imageUrl} width={32} height={24} alt='board' className='aspect-[2/3] w-8' />
  }

  return EntityIcons[type]
}
