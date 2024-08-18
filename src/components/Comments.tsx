import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { Comment } from "./Comment";
import { toast } from "react-toastify";

interface CommentType {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userPhoto: string;
  createdAt: Date;
  popularity?: number;
  parentId?: string;
}

export const Comments: React.FC = () => {
  const itemsPerPage = 8;
  const [comments, setComments] = useState<CommentType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [sortMethod, setSortMethod] = useState<"latest" | "popularity">("latest");

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = comments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //sorting comments in initial render
  useEffect(() => {
    const loadingToastId = toast.loading('Loading Comments...');
    try{
      const q = query(
        collection(db, "comments"),
        sortMethod === "latest"
          ? orderBy("createdAt", "desc")
          : orderBy("popularity", "desc")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const commentsData: CommentType[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<CommentType, 'id'>;
          const comment = { id: doc.id, ...data };
          if (!comment.parentId) {
            commentsData.push(comment);
          }
        });
        setComments(commentsData);
        toast.update(loadingToastId, {
          render: 'Comments Loaded!',
          type: 'success',
          isLoading: false,
          autoClose: 4000,
        });
      });

      return () => unsubscribe();
    }catch(err){
      toast.update(loadingToastId, {
        render: 'Something went wrong!',
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
      console.log(err);
    }
  }, [sortMethod]);

  return (
    <div className="comments">
      <h4>{"Comments (" + comments.length + ")"}</h4>

      {comments.length === 0 ? (
        <p>No Comments</p>
      ) : (
        <>
          <div className="sort-btns">
            <button
              onClick={() => setSortMethod("latest")}
              disabled={sortMethod === "latest"}
            >
              Latest
            </button>
            <button
              onClick={() => setSortMethod("popularity")}
              disabled={sortMethod === "popularity"}
            >
              Popularity
            </button>
          </div>

          {paginatedData.map((comment) => (
            <div key={comment.id} className="comment">
              <Comment comment={comment} />
            </div>
          ))}

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              style={{ cursor: "pointer" }}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(comments.length / itemsPerPage)}
            </span>
            <button
              onClick={() => {
                if (currentPage < Math.ceil(comments.length / itemsPerPage))
                  handlePageChange(currentPage + 1);
              }}
              style={{ cursor: "pointer" }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
