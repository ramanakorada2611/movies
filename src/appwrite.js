import { Client, ID, Query, Databases } from "appwrite";
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(APPWRITE_PROJECT_ID);

const databse = new Databases(client);
export const updateSearchCount = async (searchTerm, movie) => {
  // console.log("searchMovie", searchTerm, movie);
  //1)use appwrite SDK , using appwrite to check if the search term exist or not.
  try {
    const result = await databse.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Query.equal("searchTerm", searchTerm)]
    );
    // console.log("SearchMovieDocmunt", result.documents);
    //a)if does  exist increse count else.
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await databse.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        doc.$id,
        {
          count: doc.count + 1,
        }
      );
    } else {
      console.log("movvvvvv", movie);
      //2) create new document
      await databse.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      );
    }
  } catch (error) {
    console.log("errror", error);
  }
};

export const getTrandingMovies = async () => {
  try {
    const result = await databse.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Query.limit(5), Query.orderDesc("count")]
    );
    return result.documents;
  } catch (error) {
    console.log("errror", error);
  }
};
