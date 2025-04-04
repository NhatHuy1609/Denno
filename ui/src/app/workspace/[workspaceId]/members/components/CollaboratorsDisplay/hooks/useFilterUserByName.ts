import { userTypes } from "@/entities/user"
import { useState, useEffect } from "react"

type Users = userTypes.Users['users']

export const useFilterUserByName = (users: Users, input: string) => {
  const [filteredUsers, setFilteredUsers] =  useState<Users>(users)

  useEffect(() => {
    if (input) {
      setFilteredUsers((prev) => {
        const old = [...prev]
        return old.filter(user => user.fullName === input)
      })
    }
  }, [input])

  return filteredUsers
}