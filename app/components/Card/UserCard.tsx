import React from "react";

interface CardProps {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const UserCard: React.FC<CardProps> = ({ userId, id, title, body }) => {
  return (
    <div className="max-w-xl mb-4 p-4 rounded-lg border border-gray-300 shadow-md text-white">
      <h3 className="text-lg font-semibold mb-2">
        #{id} - {title}
      </h3>
      <p className="whitespace-pre-line  mb-2">{body}</p>
      <small className="text-sm ">User ID: {userId}</small>
    </div>
  );
};

export default UserCard;
