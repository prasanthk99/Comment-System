import React, { useEffect } from "react";
import { doc, updateDoc, getDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

interface PostEmojisProps {
  commentId: string; // The ID of the comment to which reactions are being added
  setShowEmojis: React.Dispatch<React.SetStateAction<boolean>>; // Function to control the visibility of the emojis
}

const PostEmojis: React.FC<PostEmojisProps> = ({ commentId, setShowEmojis }) => {
  // const [reactions, setReactions] = useState<Record<string, number>>({});
  const emojis = ["👍", "❤️", "😂", "😮", "😢", "👏"];

  useEffect(() => {
    const fetchReactions = async () => {
      const docRef = doc(db, "comments", commentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // setReactions(docSnap.data()?.reactions || {});
      }
    };
    fetchReactions();
  }, [commentId]);

  const addReaction = async (emoji: string) => {
    setShowEmojis(false);
    const postRef = doc(db, "comments", commentId);

    await updateDoc(postRef, {
      ['popularity']: increment(1),
      [`reactions.${emoji}`]: increment(1),
    });

    // setReactions((prev) => ({
    //   ...prev,
    //   [emoji]: (prev[emoji] || 0) + 1,
    // }));
  };

  return (
    <div className="emojis">
      {emojis.map((emoji) => (
        <button key={emoji} onClick={() => addReaction(emoji)}>
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default PostEmojis;
