import { useState } from "react";
import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, onSave }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = () => {
    if (file) {
      onSave(file);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-md shadow-md w-[20rem] border border-gray-200 dark:border-purple-500/20">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Upload Image</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 text-gray-700 dark:text-gray-300"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Modal;
