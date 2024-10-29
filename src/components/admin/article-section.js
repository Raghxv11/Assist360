import { addDoc, collection, doc, getDocs, getFirestore, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { fetchArticles } from '../../firebase/articles/fetch-articles';

export const ArticleSection = ({
    navigate
}) => {
    const [articles, setArticles] = useState([])

    useEffect(() => {
   
        fetchArticles().then((articles)=>{
          setArticles(articles)
        })
      }, []);
    
     
  // Group articles by groupId
  const groupedArticles = articles.reduce((acc, article) => {
    const groupId = article.groupId || 'Ungrouped';
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(article);
    return acc;
  }, {});


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
        deleted: false,
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
      await updateDoc(doc(db, "articles", articleId), {
        deleted: true,
      });
      setArticles(articles.filter((article) => article.id !== articleId ));
      alert("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Error deleting article");
    }
  };

  // Sort groups by groupId
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
