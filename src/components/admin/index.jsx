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
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArticleSection } from "./article-section";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      // Fetch users
      const usersCollection = collection(db, "users");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);

      // Fetch articles
      const articlesCollection = collection(db, "articles");
      const articleSnapshot = await getDocs(articlesCollection);
      const articleList = articleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArticles(articleList);
    };
    fetchData();
  }, []);

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

  const deleteUser = async (userId, userEmail) => {
    if (
      !window.confirm(`Are you sure you want to delete the user ${userEmail}?`)
    ) {
      return; // If the user clicks "Cancel", exit the function
    }

    const db = getFirestore();
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((user) => user.id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const toggleRole = async (userId, role) => {
    const db = getFirestore();
    const user = users.find((u) => u.id === userId);
    let newRoles = [...(user.roles || [])];

    if (newRoles.includes(role)) {
      newRoles = newRoles.filter((r) => r !== role);
    } else {
      newRoles.push(role);
    }

    try {
      await updateDoc(doc(db, "users", userId), { roles: newRoles });
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, roles: newRoles } : u))
      );
      alert(`User roles updated successfully`);
    } catch (error) {
      console.error("Error updating user roles:", error);
      alert("Error updating user roles");
    }
  };

  const generateInviteCode = async () => {
    const db = getFirestore();
    const inviteCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();
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

  const logout = () => {
    const auth = getAuth();
    signOut(auth);
    navigate("/login");
  };

  const addArticle = async () => {
    const db = getFirestore();
    try {
      const newArticle = {
        level: "beginner",
        groupId: "",
        title: "New Article",
        shortDescription: "",
        keywords: [],
        body: "",
        references: [],
        publicTitle: "", // For sensitive info management
        publicDescription: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        restrictedTo: [], // Array of roles that can access this article
      };

      const docRef = await addDoc(collection(db, "articles"), newArticle);
      setArticles([...articles, { id: docRef.id, ...newArticle }]);
    } catch (error) {
      console.error("Error adding article:", error);
      alert("Error adding article");
    }
  };

  const deleteArticle = async (articleId, articleTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the article "${articleTitle}"?`
      )
    ) {
      return;
    }

    const db = getFirestore();
    try {
      await deleteDoc(doc(db, "articles", articleId));
      setArticles(articles.filter((article) => article.id !== articleId));
      alert("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Error deleting article");
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
        articles={articles}
        addArticle={addArticle}
        deleteArticle={deleteArticle}
        navigate={navigate}
      />

      
    </div>
  );
};

export default Admin;
