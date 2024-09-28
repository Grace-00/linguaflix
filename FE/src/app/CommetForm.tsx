"use client";

import { useState } from "react";

const CommentForm = () => {
    const [content, setContent] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setStatusMessage("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
                method: "POST",
                body: JSON.stringify({ content }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Handle the response
            if (!response.ok) {
                const errorData = await response.json();
                setStatusMessage(`Error: ${errorData.error || "Something went wrong"}`);
                const newComment = await response.json();
                setStatusMessage(`Comment created successfully! ID: ${newComment.id}`);
                setContent("");
            }
            const newComment = await response.json();
            setStatusMessage(`Comment created successfully! ID: ${newComment.id}`);
            setContent("");
        } catch (error) {
            // @ts-ignore
            setStatusMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
            </button>
            {statusMessage && <p>{statusMessage}</p>}
        </form>
    );
};

export default CommentForm;
