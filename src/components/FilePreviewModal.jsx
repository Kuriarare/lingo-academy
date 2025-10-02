import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { closeFilePreview } from "../redux/filePreviewSlice";
import { FiX } from "react-icons/fi";

const FilePreviewModal = () => {
  const { isOpen, fileUrl } = useSelector((state) => state.filePreview);
  const dispatch = useDispatch();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
      <div className="relative w-full max-w-4xl h-full max-h-[90vh]">
        <button
          onClick={() => dispatch(closeFilePreview())}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          <FiX size={32} />
        </button>
        <iframe
          src={fileUrl}
          className="w-full h-full"
          title="File Preview"
        ></iframe>
      </div>
    </div>
  );
};

export default FilePreviewModal;