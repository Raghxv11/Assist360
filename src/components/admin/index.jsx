import {React, useState} from 'react'
import { useAuth } from '../../contexts/authContext'

const Admin = () => {
    // const { currentUser } = useAuth()
    const [inviteCode, setInviteCode] = useState('')

    // Function to generate a 4 digit random code consisting of digits and letters
    const generateInviteCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setInviteCode(code);
    }
    return (
        <>
        <div className='text-2xl font-bold pt-14'>
            <h1>Admin Panel</h1>
            <button onClick={generateInviteCode}>Invite</button>
            {inviteCode && <p>Generated Code: {inviteCode}</p>}
            <button>Reset</button>
            <button>Delete</button>
            <button>Manage Users</button>
            <button>List users</button>
            <button>Logout</button>
        </div>
        </>
    )
}

export default Admin
