import React, { useState, useEffect } from "react";
import { ReplyButton } from "./ReplyButton";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { CiFaceSmile } from "react-icons/ci";
import PostEmojis from "./PostEmojis";
import ReplyForm from "./ReplyForm";
import { formatElapsedTime } from "../helper/formatElapsedTime";

// Define the type for a comment
interface CommentType {
  id: string;
  text: string;
  userName: string;
  userPhoto: string;
  userId: string;
  fileUrl?: string;
  createdAt: Date;
  parentId?: string;
  reactions?: Record<string, number>;
}

// Define the props for the Comment component
interface CommentProps {
  comment: CommentType;
  depth?: number;
}

export const Comment: React.FC<CommentProps> = ({ comment, depth = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [showEmojis, setShowEmojis] = useState<boolean>(false);
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    // Fetch replies for the given comment
    const q = query(
      collection(db, "comments"),
      where("parentId", "==", comment.id),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const repliesData: CommentType[] = [];
      querySnapshot.forEach((doc) => {
        repliesData.push({ id: doc.id, ...doc.data() } as CommentType);
      });
      setReplies(repliesData);
    });

    return () => unsubscribe();
  }, [comment]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      style={{
        marginLeft: depth * 20,
        borderLeft: "1px solid #ccc",
        paddingLeft: "10px",
      }}
    >
      <div className="comment-profile">
        <img
          src={comment.userPhoto}
          alt={comment.userName}
        />
        <h4 className="font-semibold">{comment.userName}</h4>
      </div>
      <div className="comment-content">
        {comment.text && (
          <div
            dangerouslySetInnerHTML={{ __html: comment.text }}
            className={`text-gray-700 ${isExpanded ? "" : "line-clamp"}`}
          />
        )}
        {comment.fileUrl && (
          <img
            src={comment.fileUrl}
            alt="attachment"
          />
        )}
        {comment.text && comment.text.split(" ").length > 30 && (
          <a onClick={toggleExpand} className="text-expand">
            {isExpanded ? "Show Less" : "Show More..."}
          </a>
        )}
      </div>
      <div className="comment-footer">
        <div className="emoji-tab">
          <CiFaceSmile
            className="fa-smile"
            onClick={() => setShowEmojis(!showEmojis)}
          />
          {comment.reactions ? (
            Object.keys(comment.reactions).map((key, index) => (
              <span key={index}>{key + comment.reactions![key]}</span>
            ))
          ) : (
            ""
          )}
          {showEmojis && (
            <PostEmojis commentId={comment.id} setShowEmojis={setShowEmojis} />
          )}
        </div>
        <ReplyButton onClick={() => setShowReplyForm(!showReplyForm)} />
        <p style={{ paddingLeft: "10px" }}>
          {formatElapsedTime(comment.createdAt)}
        </p>
      </div>
      <div className="reply-tab">
        {showReplyForm && (
          <ReplyForm
            setShowReply={setShowReplyForm}
            parentId={comment.id}
          />
        )}
      </div>

      <div className="replies">
        {replies.map((reply) => (
          <Comment key={reply.id} comment={reply} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
};
