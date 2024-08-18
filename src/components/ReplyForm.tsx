import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import { db, storage } from "../firebase";
import { useAuth } from "../contextApi/AuthContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

// Define the type for props
interface ReplyFormProps {
  setShowReply: React.Dispatch<React.SetStateAction<boolean>>;
  parentId?: string; // parentId is optional
}

const ReplyForm: React.FC<ReplyFormProps> = ({ setShowReply, parentId }) => {
  const [reply, setReply] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const { user } = useAuth();

  // Check if the comment text is empty by removing the html element
  const isTextEmpty = (htmlString: string): boolean => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent?.trim() === "";
  };

  //Function to submit reply
  const submitReply = async () => {
    if (!reply.trim()) return toast.warning("Please Enter the comment!");

    let fileUrl = "";
    // Handle file upload if needed
    if (file) {
      const fileRef = ref(storage, `comments/${uuidv4()}`);
      await uploadBytes(fileRef, file);
      fileUrl = await getDownloadURL(fileRef);
    }

    const replyData = {
      text: reply,
      userName: user?.displayName || "",
      userPhoto: user?.photoURL || "",
      userId: user?.uid || "",
      fileUrl,
      createdAt: new Date(),
      parentId: parentId || null,
    };

    try {

      if (isTextEmpty(replyData.text)) {
        return toast.error("Enter the comment!");
      }
      setShowReply(false);
      setReply("");
      setFile(null);
      await addDoc(collection(db, "comments"), replyData);
    } catch (error) {
      console.error("Error adding reply: ", error);
    }
  };

  return (
    <div className="reply-form">
      <ReactQuill value={reply} onChange={setReply} />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <div className="reply-form-btns">
        <button onClick={() => setShowReply(false)}>Cancel</button>
        <button onClick={submitReply}>Reply</button>
      </div>
    </div>
  );
};

export default ReplyForm;
