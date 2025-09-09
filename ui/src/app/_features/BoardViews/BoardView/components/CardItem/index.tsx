import React, { useEffect, useState } from 'react'
import { cardSchemas } from '@/entities/card'
import { motion } from 'framer-motion'
import CardTitleRow from './CardTitleRow'

type Props = {
  cardData: cardSchemas.Card
}

function CardItem({ cardData }: Props) {
  const [isHover, setIsHover] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className='w-full rounded-lg border-2 border-transparent bg-white px-3 py-[6px] shadow-[0_1px_1px_rgba(0,0,0,0.15)] hover:border-2 hover:border-blue-500'
    >
      <CardTitleRow isHover={isHover} cardData={cardData} />
    </motion.div>
  )
}

export default CardItem
