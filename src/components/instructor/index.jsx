import { React, useEffect, useState } from 'react' // Import React, useState, and useEffect hooks
import { getAuth, sendPasswordResetEmail, signOut } from 'firebase/auth' // Import Firebase authentication functions
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore' // Import Firestore functions for database operations
import { useNavigate } from 'react-router-dom' // Import useNavigate for programmatic navigation
import { ArticleSection } from '../admin/article-section'

// The Instructor component represents the view for users with instructor roles
const Instructor = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchArticles = async () => {
      const db = getFirestore();
      const snapshot = await getDocs(collection(db, "articles"));
      setArticles(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchArticles();
  }, []);
  
  const addArticle = async (article) => {
    const db = getFirestore();
    await setDoc(doc(db, "articles", article.id), article);
    setArticles([...articles, article]);
  };

  const deleteArticle = async (id) => {
    const db = getFirestore();
    await deleteDoc(doc(db, "articles", id));
    setArticles(articles.filter((article) => article.id !== id));
  };

  // Here, additional logic can be implemented such as fetching user data, handling instructor-specific actions, etc.
  return (
    <div className='text-black mt-4 text-xl pt-12'>
      <div className="mb-4">
       
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
      <ArticleSection
        articles={articles}
        addArticle={addArticle}
        deleteArticle={deleteArticle}
        navigate={navigate}
      />
    </div>
  )
}

export default Instructor
