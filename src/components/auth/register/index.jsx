import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom' // Import necessary hooks from React Router
import { useAuth } from '../../../contexts/authContext' // Import the authentication context
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword } from '../../../firebase/auth' // Import Firebase auth methods

// The Register component handles both user registration and login
const Register = () => {

    const navigate = useNavigate() // Initialize navigation hook for programmatic navigation

    // Local state to manage form inputs and various states
    const [email, setEmail] = useState('') // State to store the email input
    const [password, setPassword] = useState('') // State to store the password input
    const [confirmPassword, setconfirmPassword] = useState('') // State to store the confirm password input
    const [isRegistering, setIsRegistering] = useState(false) // State to track if the user is registering
    const [errorMessage, setErrorMessage] = useState('')  // State to store error messages
    const [isLogin, setIsLogin] = useState(false) // State to toggle between login and registration
    const [isProcessing, setIsProcessing] = useState(false) // State to manage whether the form is processing
    const [invitationCode, setInvitationCode] = useState('') // State to store the invitation code input
    const { userLoggedIn, userData } = useAuth() // Destructure the authentication state from context

     // Function to handle the form submission (registration or login)
    const onSubmit = async (e) => {
        e.preventDefault() // Prevent the default form submission behavior
        if (!isProcessing) { // Check if the form is not already processing
            setIsProcessing(true) // Set the form to processing state
            setErrorMessage('') // Clear any previous error messages
            
            try {
                if (isLogin) {
                     // If the user is logging in, call the sign-in function
                    await doSignInWithEmailAndPassword(email, password)
                } else {
                    // If the user is registering, ensure passwords match
                    if (password !== confirmPassword) {
                        throw new Error("Passwords don't match") // Throw an error if passwords don't match
                    }
                    // Create the user with email, password, and invitation code
                   const result = await doCreateUserWithEmailAndPassword(email, password, invitationCode)
                   if(!result){
                    return setErrorMessage("Invalid invite code")
                }
                }
                
                // After successful login/registration, navigate based on the user's role
                if(userData){
if(userData?.roles?.includes("admin")){
    navigate('/admin') // Navigate to admin page if the user is an admin
}else{
    navigate('/home') // Otherwise, navigate to the home page
}
                }
            } catch (error) {
                setErrorMessage(error.message) // Display any error messages that occur
            } finally {
                setIsProcessing(false) // Set processing state to false when finished
            }
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <main className="w-full h-screen flex self-center place-content-center place-items-center">
                <div className="w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
                    <div className="text-center mb-6">
                        <div className="mt-2">
                            <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">
                                {isLogin ? 'Login to Your Account' : 'Create a New Account'}
                            </h3>
                        </div>
                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 font-bold">
                                Password
                            </label>
                            <input
                                disabled={isProcessing}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div>
                                    <label className="text-sm text-gray-600 font-bold">
                                        Confirm Password
                                    </label>
                                    <input
                                        disabled={isProcessing}
                                        type="password"
                                        autoComplete='off'
                                        required={!isLogin}
                                        value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }}
                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600 font-bold">
                                        Invitation Code
                                    </label>
                                    <input
                                        disabled={isProcessing}
                                        type="text"
                                        autoComplete='off'
                                        required={!isLogin}
                                        value={invitationCode} onChange={(e) => { setInvitationCode(e.target.value) }}
                                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                                    />
                                </div>
                            </>
                        )}

                        {errorMessage && (
                            <span className='text-red-600 font-bold'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                        >
                            {isProcessing ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                        <div className="text-sm text-center">
                            {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-center text-sm hover:underline font-bold"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register