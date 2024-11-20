import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

/**
 * Fetches articles, users, and their relationships from Firestore.
 * @param {string} [userId] - Optional ID of the currently logged-in user
 * @returns {Promise<{
 *   articles: Array<{
 *     id: string,
 *     title: string,
 *     level: string,
 *     groupId: string,
 *     shortDescription: string,
 *     body: string,
 *     restrictedTo: string[],
 *     deleted: boolean,
 *     createdAt: Date,
 *     updatedAt: Date
 *   }>,
 *   userArticleMap: Object<string, Array>,
 *   userList: Array<{
 *     id: string,
 *     email: string,
 *     userGroupId: string
 *   }>
 * }>}
 */
export const fetchArticles = async (userId = null) => {
  const db = getFirestore();

  try {
    // Fetch all users
    const usersQuery = userId
      ? query(collection(db, "users"), where("id", "==", userId))
      : collection(db, "users");

    const usersSnapshot = await getDocs(usersQuery);
    const userList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      userGroupId: doc.data().userGroupId,
      ...doc.data(),
    }));

    // Fetch non-deleted articles
    const articlesQuery = query(
      collection(db, "articles"),
      where("deleted", "==", false)
    );

    const articlesSnapshot = await getDocs(articlesQuery);
    const articleList = articlesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        level: data.level || "beginner",
        groupId: data.groupId || "",
        shortDescription: data.shortDescription || "",
        body: data.body || "",
        keywords: Array.isArray(data.keywords) ? data.keywords : [],
        references: Array.isArray(data.references) ? data.references : [],
        publicTitle: data.publicTitle || "",
        publicDescription: data.publicDescription || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        restrictedTo: normalizeRestrictedTo(data.restrictedTo),
        deleted: false
      };
    });

    // Create user-article mapping
    const userArticleMap = createUserArticleMap(articleList);

    return {
      articles: articleList,
      userArticleMap,
      userList
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error("Could not fetch articles: " + error.message);
  }
};

/**
 * Normalizes the restrictedTo field to always be an array
 * @param {string|string[]|null} restrictedTo 
 * @returns {string[]}
 */
function normalizeRestrictedTo(restrictedTo) {
  if (!restrictedTo) return [];
  if (Array.isArray(restrictedTo)) return restrictedTo;
  if (typeof restrictedTo === 'string') {
    return restrictedTo.split(',').map(id => id.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Creates a mapping of users to their accessible articles
 * @param {Array} articleList 
 * @returns {Object}
 */
function createUserArticleMap(articleList) {
  const userArticleMap = {};

  articleList.forEach((article) => {
    if (article.restrictedTo.length > 0) {
      article.restrictedTo.forEach((userId) => {
        if (!userArticleMap[userId]) {
          userArticleMap[userId] = [];
        }
        userArticleMap[userId].push({
          id: article.id,
          title: article.title,
          groupId: article.groupId
        });
      });
    }
  });

  return userArticleMap;
}