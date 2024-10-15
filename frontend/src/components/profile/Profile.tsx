import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Layout from '@/components/Layout'
import { useUser } from '@/hooks/useUser'
import { UserRole, User } from '@/types'
import { updateUserProfile, createAdminUser, getAllUsers, deleteUser } from '@/services/authService'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Profile() {
  const { user, loading, error, mutate } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    username: '',
    email: '',
  })

  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdminData, setNewAdminData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [users, setUsers] = useState<User[]>([])
  const [showUserList, setShowUserList] = useState(false)

  useEffect(() => {
    if (user) {
      setEditedUser({
        username: user.username,
        email: user.email,
      })
    }
  }, [user])

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div>Error: {error}</div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div>User not found</div>
      </Layout>
    )
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser({
      username: user.username,
      email: user.email,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await updateUserProfile(editedUser)
      await mutate()
      setIsEditing(false)
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleNewAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdminData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await createAdminUser(newAdminData)
      setShowCreateAdmin(false)
      setNewAdminData({ username: '', email: '', password: '' })
      toast({
        title: 'Admin user created',
        description: 'New admin user has been successfully created.',
      })
    } catch (error) {
      console.error('Failed to create admin user:', error)
      toast({
        title: 'Creation failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleFetchUsers = async () => {
    try {
      const fetchedUsers = await getAllUsers()
      setUsers(fetchedUsers)
      setShowUserList(true)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast({
        title: 'Fetch failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId)
      setUsers(users.filter((user) => user.id !== userId))
      toast({
        title: 'User deleted',
        description: 'User has been successfully deleted.',
      })
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast({
        title: 'Deletion failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl lg:gap-x-16 lg:px-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              {/* Profile Picture Frame */}
              <div className="mt-8 flex items-center justify-center">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-gray-200">
                  <Image
                    src="/UWA.jpg"
                    alt="Profile Picture"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Username
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      {isEditing ? (
                        <Input
                          type="text"
                          name="username"
                          value={editedUser.username}
                          onChange={handleChange}
                          className="w-full"
                        />
                      ) : (
                        <div className="text-gray-900">{user.username}</div>
                      )}
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Email address
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      {isEditing ? (
                        <Input
                          type="email"
                          name="email"
                          value={editedUser.email}
                          onChange={handleChange}
                          className="w-full"
                        />
                      ) : (
                        <div className="text-gray-900">{user.email}</div>
                      )}
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Role</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">
                        {user.role === UserRole.ADMIN ? 'Administrator' : 'Normal User'}
                      </div>
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 flex justify-end gap-x-6">
                  {isEditing ? (
                    <>
                      <Button type="button" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit">Save</Button>
                    </>
                  ) : (
                    <Button type="button" onClick={handleEdit}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>

              {user.role === UserRole.ADMIN && (
                <div className="mt-10">
                  <h2 className="mb-4 text-2xl font-bold">Admin Actions</h2>
                  {!showCreateAdmin ? (
                    <div className="space-y-4">
                      <Button onClick={() => setShowCreateAdmin(true)}>Create Admin User</Button>
                      <Button onClick={handleFetchUsers}>View All Users</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                      <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={newAdminData.username}
                        onChange={handleNewAdminChange}
                        required
                      />
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={newAdminData.email}
                        onChange={handleNewAdminChange}
                        required
                      />
                      <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={newAdminData.password}
                        onChange={handleNewAdminChange}
                        required
                      />
                      <div className="flex justify-end gap-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateAdmin(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create Admin</Button>
                      </div>
                    </form>
                  )}

                  {showUserList && (
                    <div className="mt-6">
                      <h3 className="mb-2 text-xl font-semibold">User List</h3>
                      <Table>
                        <TableCaption>A list of all users</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>{formatDate(user.createdAt)}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => handleDeleteUser(user.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}
