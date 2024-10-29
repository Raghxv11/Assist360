import React from 'react'

export const ArticleSection = ({
    articles,
    addArticle,
    deleteArticle,
    navigate
}) => {
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
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Level</th>
              <th className="py-2 px-4 border-b">Group ID</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="py-2 px-4 border-b">{article.title}</td>
                <td className="py-2 px-4 border-b">{article.level}</td>
                <td className="py-2 px-4 border-b">
                  {article.groupId || "None"}
                </td>
                <td className="py-2 px-4 border-b">
                  {article.shortDescription.substring(0, 100)}
                  {article.shortDescription.length > 100 ? "..." : ""}
                </td>
                <td className="py-2 px-4 border-b">
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
      </div>  )
}
