import { React, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const ArticleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: "",
    publicTitle: "",
    level: "beginner",
    groupId: "",
    shortDescription: "",
    publicDescription: "",
    keywords: [], // Ensure these are arrays even if empty
    body: "",
    references: [], // Ensure these are arrays even if empty
    restrictedTo: [], // Ensure these are arrays even if empty
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      alert(id);
      if (!id) {
        setError("No article ID provided");
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore();
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setArticle({
            id: docSnap.id,
            ...data,
            keywords: data.keywords || [],
            references: data.references || [],
            restrictedTo: data.restrictedTo || [],
          });
        } else {
          setError("Article not found");
          navigate("/admin");
        }
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Error loading article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value.split(",").map((item) => item.trim());
    setArticle((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLevelChange = (e) => {
    setArticle((prev) => ({
      ...prev,
      level: e.target.value,
    }));
  };

  const handleRestrictedToChange = (role) => {
    setArticle((prev) => ({
      ...prev,
      restrictedTo: prev.restrictedTo.includes(role)
        ? prev.restrictedTo.filter((r) => r !== role)
        : [...prev.restrictedTo, role],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore();

    try {
      await updateDoc(doc(db, "articles", id), {
        ...article,
        updatedAt: new Date(),
      });
      alert("Article updated successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Error updating article");
    }
  };

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Title (Internal)</label>
            <input
              type="text"
              name="title"
              value={article.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Public Title</label>
            <input
              type="text"
              name="publicTitle"
              value={article.publicTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Level</label>
            <select
              value={article.level}
              onChange={handleLevelChange}
              className="w-full p-2 border rounded"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Group ID</label>
            <input
              type="text"
              name="groupId"
              value={article.groupId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Short Description (Internal)</label>
          <textarea
            name="shortDescription"
            value={article.shortDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="2"
          />
        </div>

        <div>
          <label className="block mb-1">Public Description</label>
          <textarea
            name="publicDescription"
            value={article.publicDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="2"
          />
        </div>

        <div>
          <label className="block mb-1">Keywords (comma-separated)</label>
          <input
            type="text"
            value={(article.keywords || []).join(", ")}
            onChange={(e) => handleArrayChange(e, "keywords")}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Body</label>
          <textarea
            name="body"
            value={article.body}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="10"
          />
        </div>

        <div>
          <label className="block mb-1">
            References (comma-separated URLs)
          </label>
          <input
            type="text"
            value={(article.references || []).join(", ")}
            onChange={(e) => handleArrayChange(e, "references")}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Restricted To:</label>
          <div className="space-x-2">
            {["student", "instructor", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRestrictedToChange(role)}
                className={`px-3 py-1 rounded ${
                  article.restrictedTo.includes(role)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleEdit;
