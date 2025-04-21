import React from 'react'
import { db } from '@/app/lib/db'
import AllUsersTable from './components/all-users'

const TeamPage = async () => {
    const userdata = await db.user.findMany({})
  return (
    <div><AllUsersTable data={userdata}/></div>
  )
}

export default TeamPage