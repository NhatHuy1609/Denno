import React, { useState, useRef } from 'react'
import PrimaryInputText from '@/app/_components/PrimaryInputText'
import { useUsersQuery } from '@/app/_hooks/query/user/useUsersQuery'
import { userTypes } from '@/entities/user'

type SearchedUserFilter = Pick<userTypes.UsersFilterQuery, 'email'>

function InviteMemberModalBody() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchedUserFilter, setSearchedUserFilter] = useState<SearchedUserFilter>({
    email: ''
  })
  const { data } = useUsersQuery(searchedUserFilter)

  console.log('SEARCHED USER')

  const handleSearchUser = () => {
    setSearchedUserFilter({
      email: inputRef.current?.value
    })
  }

  return (
    <div className='flex'>
      <PrimaryInputText
        ref={inputRef}
        // onInput={handleSearchUser}
        className='w-full border-gray-500 p-2'
        placeholder='Email address or name'
      />
      <div className='h-16'></div>
    </div>
  )
}

export default InviteMemberModalBody
