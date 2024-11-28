import { MdDelete, MdEdit } from "react-icons/md";

const MessageOptionsCard = ({ onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow-lg rounded-md p-2 flex flex-col space-y-2">
      {/* <button
        onClick={onEdit}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
      >
        <MdEdit className="text-lg" />
        <span>Edit</span>
      </button> */}
      <button
        onClick={onDelete}
        className="flex items-center space-x-2 text-red-600 hover:text-red-800"
      >
        <MdDelete className="text-lg" />
      </button>
    </div>
  );
};

export default MessageOptionsCard;
