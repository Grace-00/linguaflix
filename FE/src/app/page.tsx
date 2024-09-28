import { Comment } from '../../types'
import CommentForm from './CommetForm';


async function fetchComments(): Promise<Comment[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

export default async function HomePage() {
  const comments = await fetchComments();

  return (
    <div>
      <h1>Comments</h1>

      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id}>
            <h4>{comment?.user?.username}</h4>
            <p>{comment.content}</p>
          </div>
        ))
      )}


      <CommentForm />
    </div>
  );
}
