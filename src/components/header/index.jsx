import React from 'react'
import { Link, useNavigate } from 'react-router-dom'  // Import necessary hooks from React Router
import { useAuth } from '../../contexts/authContext' // Import the authentication context
import { doSignOut } from '../../firebase/auth' // Import the sign-out function from Firebase Auth

// The Header component is a navigation bar that displays different options based on the user's login status.
const Header = () => {
    const navigate = useNavigate() // Initialize navigation hook for programmatic navigation
    const { userLoggedIn } = useAuth() // Destructure the `userLoggedIn` state from the auth context
    //get current path
    const currentPath = window.location.pathname;
    return (
        // Navigation bar container with Tailwind CSS for styling
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {
                userLoggedIn
                    ?
                    <>
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-blue-600 underline'>Logout</button>
                    </>
                    :
                     // If the user is not logged in, show login and register links
                    <>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>
                            {
                                currentPath === '/login' ? 'Login' : 'Logout'
                            }
                        </Link>
                        <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}

export default Header