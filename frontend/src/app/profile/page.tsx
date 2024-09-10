'use client'

import React from 'react'
import withAuth from '@/components/auth/withAuth' // Import the withAuth HOC
import Profile from '@/components/profile/Profile'

const ProfilePage = () => {
  return (
    <div>
      <Profile />
    </div>
  )
}

export default withAuth(ProfilePage)
