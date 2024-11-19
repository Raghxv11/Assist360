import { React, useState, useEffect } from 'react'
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'

const Student = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [supportMessage, setSupportMessage] = useState('');

  // Fetch articles that students have access to
  useEffect(() => {
    const fetchArticles = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, "articles"),
        where("restrictedTo", "array-contains", "student")
      );
      
      try {
        const querySnapshot = await getDocs(q);
        const articleData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setArticles(articleData);
        setFilteredArticles(articleData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = articles.filter(article => 
      article.keywords?.some(keyword => keyword.toLowerCase().includes(term)) ||
      article.publicTitle.toLowerCase().includes(term) ||
      article.publicDescription.toLowerCase().includes(term)
    );
    setFilteredArticles(filtered);
  };

  // Handle support request
  const handleSupportRequest = async (e) => {
    e.preventDefault();
    // Here you would implement the actual support request submission
    // For now, we'll just show an alert
    alert('Support request submitted: ' + supportMessage);
    setSupportMessage('');
  };

  return (
    <div className='text-black mt-4 text-xl pt-12'>
      <div className="mb-8 flex flex-col justify-center items-center">
        <h1 className='text-4xl font-bold text-center'>Articles</h1>
        <p className='text-lg text-center mt-4'>Here you can find all the articles that you have access to.</p>
        
        {/* Search Section */}
        <div className="w-full max-w-2xl mt-6">
          <input
            type="text"
            placeholder="Search articles by keyword..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Articles Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        
        {filteredArticles.map(article => (
          <div key={article.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-2">{article.publicTitle}</h2>
            <p className="text-gray-600 mb-2">{article.publicDescription}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {article.keywords?.map((keyword, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
                  {keyword}
                </span>
              ))}
            </div>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {article.level}
            </span>
          </div>
        ))}
      </div>

      {/* Support Request Section */}
      <div className="mt-12 max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
        <form onSubmit={handleSupportRequest} className="space-y-4">
          <textarea
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Describe what you're looking for and our team will help you find it..."
            className="w-full p-2 border rounded-lg h-32"
            required
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          >
            Submit Support Request
          </button>
        </form>
      </div>
    </div>
  )
}

export default Student
