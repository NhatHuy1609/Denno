import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cardSchemas } from '@/entities/card'
import { AnimatedCircleCheckbox } from '@/app/_components/AnimatedCircleCheckbox'
import { useToggleCardCompletionStatus } from '@/app/_hooks/mutation/card/useToggleCardCompletionStatus'

type Props = {
  isHover: boolean
  cardData: cardSchemas.Card
}

function CardTitleRow({ isHover, cardData }: Props) {
  const { name, id, isCompleted } = cardData
  const [isChecked, setIsChecked] = useState(isCompleted)

  const { toggleCardCompletionStatusAsync } = useToggleCardCompletionStatus({
    cardId: id,
    isCompleted: isChecked,
    onMarkAsInCompletedFailed: () => {
      setIsChecked(true)
    },
    onMarkAsCompletedFailed: () => {
      setIsChecked(false)
    }
  })

  useEffect(() => {
    setIsChecked(isCompleted)
  }, [isCompleted])

  const handleChangeCheckbox = async () => {
    setIsChecked(!isChecked)
    await toggleCardCompletionStatusAsync()
  }

  return (
    <div className='inline-flex items-center gap-2'>
      <motion.div
        layout
        initial={{ opacity: 0, width: 0 }}
        animate={isChecked || isHover ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
        transition={{ duration: 0.35 }}
      >
        <AnimatedCircleCheckbox checked={isChecked} onChange={handleChangeCheckbox} />
      </motion.div>

      <motion.span layout className='text-sm'>
        {name}
      </motion.span>
    </div>
  )
}

export default CardTitleRow
