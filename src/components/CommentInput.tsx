import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../contextApi/AuthContext";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";


export const CommentInput: React.FC = () => {
  const { user } = useAuth();
  const [comment, setComment] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // Check if the comment text is empty
  const isTextEmpty = (htmlString: string): boolean => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent?.trim() === "";
  };

  const handleCommentSubmit = async () => {
    if (isTextEmpty(comment)) {
      return toast.error("Please Enter the comment!");
    }
    if (!comment.trim()) return;

    const loadingToastId = toast.loading('Comment Loading...');
    try{
      let fileUrl = "";
      if (file) {
        const fileRef = ref(storage, `comments/${uuidv4()}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, "comments"), {
        text: comment,
        userName: user?.displayName ?? "Anonymous",
        userPhoto: user?.photoURL ?? "",
        userId: user?.uid ?? "",
        fileUrl,
        createdAt: new Date(),
        popularity:0
      });
      // toast.success("Comment Added Successfully!");
      toast.update(loadingToastId, {
        render: 'Comment Added Successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 4000,
      });
      setComment("");
      setFile(null);
    }catch(error){
      toast.update(loadingToastId, {
        render: 'Something went wrong!',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      console.log(error);
    }
  };

  return (
    <div className="inputBox">
      <ReactQuill value={comment} onChange={setComment} />
      <div className="inputbtns">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <button onClick={handleCommentSubmit}>Send</button>
      </div>
    </div>
  );
};
