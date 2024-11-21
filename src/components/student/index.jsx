import { React, useState, useEffect } from 'react'
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'
import { useAuth } from '../../contexts/authContext'

// State variables for managing component data
const Student = () => {
  const { userData } = useAuth();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [supportMessage, setSupportMessage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchHistory, setSearchHistory] = useState([]);
  const [viewingArticle, setViewingArticle] = useState(null);

  // Fetch articles that students have access to
  useEffect(() => {
    const fetchArticles = async () => {
      if (!userData) return; // Wait for userData to be available

      const db = getFirestore();
      try {
        let q = query(
          collection(db, "articles"),
          where("restrictedTo", "array-contains", "student")
        );

        // Only add group filter if user has a group assigned
        if (userData.groups) {
          q = query(
            collection(db, "articles"),
            where("groupId", "in", userData.groups)
          );
        }

        // Add individual access filter based on the user's email
        let individualQuery = null;
        if (userData.email) {
          individualQuery = query(
            collection(db, "articles"),
            where("individualAccess", "array-contains", userData.email)
          );
        }

        // Fetch articles for groups and individual access concurrently
        const [groupSnapshot, individualSnapshot] = await Promise.all([
          getDocs(q),
          individualQuery ? getDocs(individualQuery) : Promise.resolve({ docs: [] })
        ]);

        // Combine fetched articles into a single array
        const articleData = [...groupSnapshot.docs, ...individualSnapshot.docs].map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Set the state with the fetched articles
        setArticles(articleData);
        setFilteredArticles(articleData);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [userData]);

  // Handles the search input and updates filtered articles
  // Enhanced search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Add search term to history
    if (term) {
      setSearchHistory(prev => [...prev, { term, timestamp: new Date() }]);
    }

    let filtered = articles.filter(article =>
      article.keywords?.some(keyword => keyword.toLowerCase().includes(term)) ||
      article.publicTitle.toLowerCase().includes(term) ||
      article.publicDescription.toLowerCase().includes(term)
    );

    // Apply level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(article => article.level === selectedLevel);
    }

    // Apply group filter
    if (selectedGroup !== 'all') {
      filtered = filtered.filter(article => article.groupId === selectedGroup);
    }

    setFilteredArticles(filtered);
  };

  // Add new handlers
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
    handleSearch({ target: { value: searchTerm } }); // Rerun search with new level
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    handleSearch({ target: { value: searchTerm } }); // Rerun search with new group
  };

  // Enhanced support request handling
  const handleSupportRequest = async (e, type) => {
    e.preventDefault();
    const supportData = {
      message: supportMessage,
      type: type, // 'generic' or 'specific'
      searchHistory: type === 'specific' ? searchHistory : [],
      timestamp: new Date()
    };

    // Here you would implement the actual support request submission
    console.log('Support request:', supportData);
    alert(`${type} support request submitted`);
    setSupportMessage('');
  };

  // Add this new function after the existing useEffect
  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const groupId = article.groupId || 'Ungrouped';
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(article);
    return acc;
  }, {});

  // Sort the groups (Ungrouped goes last)
  const sortedGroups = Object.keys(groupedArticles).sort((a, b) => {
    if (a === 'Ungrouped') return 1;
    if (b === 'Ungrouped') return -1;
    return parseInt(a) - parseInt(b);
  });

  // Render the component
  return (
    <div className='text-black mt-4 text-xl pt-12'>
      <div className="mb-8 flex flex-col justify-center items-center">
        <h1 className='text-4xl font-bold text-center'>Articles</h1>
        <p className='text-lg text-center mt-4'>Here you can find all the articles that you have access to.</p>

        {/* Add filters section */}
        <div className="w-full max-w-2xl flex gap-4 mb-4">
          <select
            value={selectedLevel}
            onChange={handleLevelChange}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>

        </div>

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
      {sortedGroups.map(groupId => (
        <div key={groupId} className="mb-8 px-4">
          <h2 className="text-2xl font-bold mb-4">
            {groupId === 'Ungrouped' ? 'Ungrouped Articles' : `Group ${groupId}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedArticles[groupId].map(article => (
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
        </div>
      ))}

      {/* Enhanced support request section */}
      <div className="mt-12 max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <form className="space-y-4">
          <textarea
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            placeholder="Describe what you need help with..."
            className="w-full p-2 border rounded-lg h-32"
            required
          />
          <div className="flex gap-4">
            <button
              onClick={(e) => handleSupportRequest(e, 'generic')}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
            >
              Submit Generic Help Request
            </button>
            <button
              onClick={(e) => handleSupportRequest(e, 'specific')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Submit Specific Help Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Student
