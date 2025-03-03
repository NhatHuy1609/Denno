import React from 'react'
import { useCardListContext } from '../context'
import { useCardsByCardList } from '@/app/_hooks/query/card/useCardsByCardList'
import CardItem from '../CardItem'

function CardListBody() {
  const { cardListData } = useCardListContext()
  const { data: cards } = useCardsByCardList({ cardListId: cardListData?.id || '' })

  console.log('CARDS DATA: ', cards)

  return <div>{cards?.map((card) => <CardItem key={card.id} cardData={card} />)}</div>
}

export default CardListBody
