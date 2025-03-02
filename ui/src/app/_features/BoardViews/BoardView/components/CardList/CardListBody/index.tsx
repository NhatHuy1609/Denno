import React from 'react'
import { useCardListContext } from '../context'
import { useCardsByCardList } from '@/app/_hooks/query/card/useCardsByCardList'
import CardItem from '../CardItem'

function CardListBody() {
  const { cardListData } = useCardListContext()
  const { data: cards } = useCardsByCardList({ cardListId: cardListData?.id || '' })

  return <div>{cards?.map((card) => <CardItem key={card.id} />)}</div>
}

export default CardListBody
