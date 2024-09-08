'use client'

import React from 'react'
import withAuth from '@/components/withAuth' // Import the withAuth HOC
import Profile from '@/components/Profile'

const ProfilePage = () => {
  return (
    <div>
      <Profile />
    </div>
  )
}

export default withAuth(ProfilePage)
