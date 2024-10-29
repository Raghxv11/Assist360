import { getFirestore, collection, getDocs } from "firebase/firestore";

export const fetchArticles = async () => {
    const db = getFirestore();
    // Fetch users
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch articles
    const articlesCollection = collection(db, "articles");
    const articleSnapshot = await getDocs(articlesCollection);
    const articleList = articleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return articleList.filter((article) => !article.deleted);
  };