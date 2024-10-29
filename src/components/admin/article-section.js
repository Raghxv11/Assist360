import React from 'react'

export const ArticleSection = ({
    articles,
    addArticle,
    deleteArticle,
    navigate
}) => {
  // Group articles by groupId
  const groupedArticles = articles.reduce((acc, article) => {
    const groupId = article.groupId || 'Ungrouped';
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(article);
    return acc;
  }, {});

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
        <button className='bg-purple-500 text-white px-4 py-2 rounded ml-4'>Backup</button>
      </div>
      {sortedGroups.map(groupId => (
        <div key={groupId} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Group {groupId}
          </h3>
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
