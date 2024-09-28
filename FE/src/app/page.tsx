import { Comment } from "../../types";

async function fetchComments(): Promise<Comment[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is not defined. Please check your environment variables.");
  }

  const response = await fetch(apiUrl, { cache: 'no-store' }); // cache: 'no-store' ensures no stale data
  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

export default async function Home() {
  const comments = await fetchComments();

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <h4>{comment.user.username}</h4>
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
