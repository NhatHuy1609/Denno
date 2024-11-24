import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { boardTypes } from '@/entities/board'
import { FaRegStar } from 'react-icons/fa'

interface Props {
  item: boardTypes.Board
}

function BoardItem({ item }: Props) {
  const { background: backgroundSource, name, id } = item

  return (
    <Link
      href={`/b/${id}`}
      className='group relative block min-h-24 w-full overflow-hidden rounded-md'
    >
      <div className='absolute inset-0 group-hover:brightness-90'>
        <Image
          width={120}
          height={80}
          alt='board image'
          src={backgroundSource}
          className='size-full object-cover'
        />
      </div>
      <span className='absolute left-2 top-1 block font-bold text-white'>{name}</span>
      <button
        type='button'
        className='absolute bottom-3 right-0 translate-x-4 transition-transform hover:scale-125 group-hover:-translate-x-3'
      >
        <FaRegStar className='text-base text-amber-400' />
      </button>
    </Link>
  )
}

export default BoardItem
