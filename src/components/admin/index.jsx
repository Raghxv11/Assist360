/**
 * Admin Component
 *
 * This component provides an interface for managing users and articles within the admin
 * section of the application. It includes functionality for deleting users, sending password
 * reset emails, toggling user roles, generating invite codes, and signing out. Additionally,
 * it renders the `ArticleSection` component, which handles article management.
 *
 * @component
 * @param {Object} props - React component props
 */
import { React, useEffect, useState } from "react";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArticleSection } from "./article-section";
import { fetchArticles } from "../../firebase/articles/fetch-articles";
import { getUsers } from "../../contexts/getUsers";

const Admin = () => {
  const [users, setUsers] = useState([]); // State to store user data
  const navigate = useNavigate();

  useEffect(()=>{
    getUsers().then((users)=>{
      setUsers(users)
    })
  }, [])
  /**
   * Deletes a user from Firestore after user confirmation
   * @param {string} userId - ID of the user to delete
   * @param {string} userEmail - Email of the user, shown in confirmation prompt
   */
  const deleteUser = async (userId, userEmail) => {
    if (
      !window.confirm(`Are you sure you want to delete the user ${userEmail}?`)
    ) {
      return; // If the user clicks "Cancel", exit the function
    }

    const db = getFirestore();
    try {
      await deleteDoc(doc(db, "users", userId)); // Delete user document from Firestore
      setUsers(users.filter((user) => user.id !== userId)); // Update state to reflect deletion
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  /**
   * Sends a password reset email to the specified email address
   * @param {string} email - User's email to which the password reset email is sent
   */
  const resetPassword = async (email) => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Error sending password reset email");
    }
  };

  /**
   * Toggles a specific role for a user. Adds the role if the user doesn’t have it, or removes it if they do.
   * @param {string} userId - ID of the user
   * @param {string} role - Role to be toggled (e.g., 'admin', 'student', 'instructor')
   */
  const toggleRole = async (userId, role) => {
    const db = getFirestore();
    const user = users.find((u) => u.id === userId); // Find user by ID
    let newRoles = [...(user.roles || [])]; // Clone current roles
    // Add or remove the role from the user's roles
    if (newRoles.includes(role)) {
      newRoles = newRoles.filter((r) => r !== role);
    } else {
      newRoles.push(role);
    }

    try {
      await updateDoc(doc(db, "users", userId), { roles: newRoles }); // Update user roles in Firestore
      // Update state to reflect role change
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, roles: newRoles } : u))
      );
      alert(`User roles updated successfully`);
    } catch (error) {
      console.error("Error updating user roles:", error);
      alert("Error updating user roles");
    }
  };
  /**
   * Generates an invitation code and stores it in Firestore, making it available for future user invites
   */
  const generateInviteCode = async () => {
    const db = getFirestore();
    const inviteCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase(); // Generate random invite code
    try {
      await setDoc(doc(db, "codes", inviteCode), {
        code: inviteCode,
        createdAt: new Date(),
        used: false,
      });
      alert(`Invitation code generated: ${inviteCode}`);
    } catch (error) {
      console.error("Error generating invite code:", error);
      alert("Error generating invite code");
    }
  };
  /**
  * Logs the user out of the application and redirects to the login page
  */
  const logout = () => {
    const auth = getAuth();
    signOut(auth);
    navigate("/login");
  };

  const assignGroup = async (userId, groupId) => {
    const db = getFirestore();
    try {
      // First verify the user document exists
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error("User document not found");
      }

      // Update the user document
      await updateDoc(userRef, {
        group: groupId,
        updatedAt: new Date() // Add a timestamp
      });

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, group: groupId }
            : user
        )
      );

      alert("Group assigned successfully");
    } catch (error) {
      console.error("Error assigning group:", error);
      alert(`Error assigning group: ${error.message}`);
    }
  };

  return (
    <div className="text-black mt-4 text-xl pt-12">
      <div className="mb-4">
        <button
          onClick={generateInviteCode}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Invite User
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Roles</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b text-center">{user.email}</td>
              <td className="py-2 px-4 border-b text-center">
                {user.roles?.join(", ") || "No roles"}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => resetPassword(user.email)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => deleteUser(user.id, user.email)}
                  className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                >
                  Delete User
                </button>
                <select
                  onChange={(e) => assignGroup(user.id, e.target.value)}
                  value={user.group || ""}
                  className="bg-gray-300 text-black px-2 py-1 rounded mr-2"
                >
                  <option value="">Select Group</option>
                  <option value="group1">Group 1</option>
                  <option value="group2">Group 2</option>
                  <option value="group3">Group 3</option>
                </select>
                {["admin", "student", "instructor"].map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(user.id, role)}
                    className={`${
                      user.roles?.includes(role)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    } text-white px-2 py-1 rounded mr-2`}
                  >
                    {role}
                  </button>
                
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ArticleSection
       
        navigate={navigate}
      />

      
    </div>
  );
};

export default Admin;
