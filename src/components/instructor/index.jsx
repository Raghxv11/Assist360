// Import required dependencies from React and Firebase


import React, { useEffect, useState } from 'react'; // Import React, useState, and useEffect hooks
import { getAuth, sendPasswordResetEmail, signOut } from 'firebase/auth'; // Import Firebase authentication functions
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'; // Import Firestore functions for database operations
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import { ArticleSection } from '../admin/article-section'; // Import ArticleSection component

// State variables for managing component data
// The Instructor component represents the view for users with instructor roles
const Instructor = () => {
  const [articles, setArticles] = useState([]);
  const [userId, setUserId] = useState(null); // State to store userId
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, "articles"));
      setArticles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchUserId = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid); // Set userId from authenticated user
      }
    };

    fetchArticles();
    fetchUserId();
  }, []);

  const addArticle = async (article) => {
    const db = getFirestore();
    await setDoc(doc(db, "articles", article.id), article);
    setArticles([...articles, article]);
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
      await updateDoc(doc(db, "articles", articleId), {
        deleted: true,
      });
      setArticles(articles.filter((article) => article.id !== articleId));
      alert("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Error deleting article");
    }
  };

  // Here, additional logic can be implemented such as fetching user data, handling instructor-specific actions, etc.
  return (
    <div className='text-black mt-4 text-xl pt-12'>
      <div className="mb-4">
        {/* Additional UI elements can be added here */}
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
          THIS IS INSTRUCTOR ACCESS
        </tbody>
      </table>
      {userId && (
        <ArticleSection
          navigate={navigate}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Instructor;