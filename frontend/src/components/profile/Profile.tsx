import { useState, useEffect } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
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
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    {isEditing ? (
                      <Input
                        id="username"
                        type="text"
                        name="username"
                        value={editedUser.username}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 text-gray-900">{user.username}</div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 text-gray-900">{user.email}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <div className="mt-1 text-gray-900">
                      {user.role === UserRole.ADMIN ? 'Administrator' : 'Normal User'}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="mr-4"
                      >
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
            </CardContent>
          </Card>

          {user.role === UserRole.ADMIN && (
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {!showCreateAdmin ? (
                  <div className="space-x-4">
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
                    <div className="flex justify-end space-x-4">
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
                  <div className="mt-8">
                    <Separator className="my-4" />
                    <h3 className="mb-4 text-xl font-semibold">User List</h3>
                    <Table>
                      <TableCaption>A list of all users</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
