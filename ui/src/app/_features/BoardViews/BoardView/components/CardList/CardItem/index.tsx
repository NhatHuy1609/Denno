import { cardTypes } from '@/entities/card'
import React from 'react'

interface Props {
  cardData?: cardTypes.Card
}

function CardItem({ cardData }: Props) {
  const { name } = cardData || {}

  return <div>{name}</div>
}

export default CardItem
