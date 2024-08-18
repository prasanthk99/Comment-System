import React from "react";
import { FaReply } from "react-icons/fa";

// Define the props type for the ReplyButton component
interface ReplyButtonProps {
  onClick: () => void; // Function type for the onClick handler
}

export const ReplyButton: React.FC<ReplyButtonProps> = ({ onClick }) => {
  return (
    <div className="reply-btn">
      <a
        onClick={onClick}
        className=""
      >
        <FaReply />
        Reply
      </a>
    </div>
  );
};
