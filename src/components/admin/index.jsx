import { React, useEffect, useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, addDoc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore()
      const usersCollection = collection(db, 'users')
      const userSnapshot = await getDocs(usersCollection)
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setUsers(userList)
    }
    fetchUsers()
  }, [])

  const resetPassword = async (email) => {
    const auth = getAuth()
    try {
      await auth.sendPasswordResetEmail(email)
      alert('Password reset email sent')
    } catch (error) {
      console.error('Error sending password reset email:', error)
      alert('Error sending password reset email')
    }
  }

  const deleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete the user ${userEmail}?`)) {
      return; // If the user clicks "Cancel", exit the function
    }

    const db = getFirestore()
    try {
      await deleteDoc(doc(db, 'users', userId))
      setUsers(users.filter(user => user.id !== userId))
      alert('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  const switchRole = async (userId, currentRole) => {
    const db = getFirestore()
    let newRole
    switch (currentRole) {
      case 'admin':
        newRole = 'student'
        break
      case 'student':
        newRole = 'instructor'
        break
      case 'instructor':
        newRole = 'admin'
        break
      default:
        newRole = 'student'
    }
    try {
      await updateDoc(doc(db, 'users', userId), { roles: [newRole] })
      setUsers(users.map(user => user.id === userId ? { ...user, roles: [newRole] } : user))
      alert(`User role updated to ${newRole} successfully`)
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Error updating user role')
    }
  }

  const generateInviteCode = async () => {
    const db = getFirestore()
    const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase()
    try {
      await setDoc(doc(db, 'codes',inviteCode), {
        code: inviteCode,
        createdAt: new Date(),
        used: false
      })
      alert(`Invitation code generated: ${inviteCode}`)
    } catch (error) {
      console.error('Error generating invite code:', error)
      alert('Error generating invite code')
    }
  }

  const logout = () => {
    const auth = getAuth()
    signOut(auth)
    navigate('/login')
  }

  return (
    <div className='text-black mt-4 text-xl pt-12'>
      <div className="mb-4 space-x-4">
        <button 
          onClick={generateInviteCode} 
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Invite User
        </button>
        <button
          onClick={logout}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.email.replace("@gmail.com", "")}

                { <span className='bg-green-500 p-1 text-sm ml-4 text-red-500'>
                  {user?.roles?.join(", ")}
                  </span>}
              </td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => resetPassword(user.email)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Reset Password
                </button>
                <button onClick={() => deleteUser(user.id, user.email)} className="bg-red-500 text-white px-2 py-1 rounded mr-2">
                  Delete User
                </button>
                <button onClick={() => switchRole(user.id, user.roles[0])} className="bg-green-500 text-white px-2 py-1 rounded">
                  Switch Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Admin
