/**
 * ArticleSection Component
 *
 * This component is responsible for rendering, adding, and managing articles within
 * the application. Articles are grouped by `groupId` and can be created, deleted, 
 * and managed by the user. Each group displays articles with actions for editing 
 * and deletion, along with backup and restore options for managing group data. 
 *
 * @component
 * @param {Object} props - React component props
 * @param {function} props.navigate - Navigation function to redirect the user to article edit pages
 */
import { addDoc, collection, doc, getDocs, getFirestore, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { fetchArticles } from '../../firebase/articles/fetch-articles';

export const ArticleSection = ({
    navigate
}) => {
    const [articles, setArticles] = useState([]) // State to store articles

    useEffect(() => {
        // Fetches articles when the component mounts and sets them in state
        fetchArticles().then((articles)=>{
          setArticles(articles)
        })
      }, []);
    
     
  /**
  * Groups articles by their `groupId`, defaulting to 'Ungrouped' if no `groupId` is set.
  * @returns {Object} - An object with group IDs as keys and arrays of articles as values
  */
  const groupedArticles = articles.reduce((acc, article) => {
    const groupId = article.groupId || 'Ungrouped';  // Default group for articles without a groupId
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(article);
    return acc;
  }, {});

  /**
   * Adds a new article to Firestore with default values and updates state
   */
  const addArticle = async () => {
    const db = getFirestore();
    try {
      // Define default properties for a new article
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
        deleted: false,
      };
      // Add new article to Firestore and update the local state
      const docRef = await addDoc(collection(db, "articles"), newArticle);
      setArticles([...articles, { id: docRef.id, ...newArticle }]); // Add the new article to state
    } catch (error) {
      console.error("Error adding article:", error);
      alert("Error adding article");
    }
  };
  /**
  * Marks an article as deleted in Firestore by setting `deleted` to true
  * @param {string} articleId - ID of the article to delete
  * @param {string} articleTitle - Title of the article for user confirmation
  */
  const deleteArticle = async (articleId, articleTitle) => {
  // Confirm deletion with the user
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
      setArticles(articles.filter((article) => article.id !== articleId )); // Update state to reflect deletion
      alert("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Error deleting article");
    }
  };

    /**
     * Sorts the grouped article keys, placing 'Ungrouped' last, and returns a sorted list of keys
     */
  const sortedGroups = Object.keys(groupedArticles).sort((a, b) => {
    if (a === 'Ungrouped') return 1;
    if (b === 'Ungrouped') return -1;
    return parseInt(a) - parseInt(b);
  });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Articles</h2>
      <div className="mb-4">
        <button
          onClick={addArticle}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Article
        </button>
      </div>
      {sortedGroups.map(groupId => (
        <div key={groupId} className="mb-8">
            <div className='flex justify-between items-center mb-4'>

          <h3 className="text-xl font-semibold mb-4">
            Group {groupId}
          </h3>
          <div className='flex gap-4'>

          <button className='bg-purple-500 text-white px-4 py-2 rounded ml-4'
          
          onClick={()=>{
            alert("Backup Successful")
          }}
          
          >Backup</button>
          <button className='bg-purple-500 text-white px-4 py-2 rounded ml-4'
          onClick={async()=>{    const db = getFirestore();
const articles = await getDocs(collection(db, "articles"), where("groupId", "==", groupId))
           for(const article of articles.docs){
            console.log(article)
            await updateDoc(doc(db, "articles", article.id), {
                deleted: false,
              });
           }
           await fetchArticles().then((articles)=>{
            setArticles(articles)
           })
           alert("Restore Successful")
          }}
          >
            Restore
          </button>
            </div>
          </div>

          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Level</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedArticles[groupId].map((article) => (
                <tr key={article.id}>
                  <td className="py-2 px-4 border-b text-center">{article.title}</td>
                  <td className="py-2 px-4 border-b text-center">{article.level}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {article.shortDescription.substring(0, 100)}
                    {article.shortDescription.length > 100 ? "..." : ""}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => navigate(`/admin/articles/${article.id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id, article.title)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
