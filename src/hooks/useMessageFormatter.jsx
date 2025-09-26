import React from "react";

const useMessageFormatter = () => {
  const formatMessageWithLinks = (text, isSender) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white " : "text-blue-600 underline"}`}
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `${date.toLocaleTimeString()}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString()}`;
    } else {
      return `${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })} at ${date.toLocaleTimeString()}`;
    }
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const cleanFileName = (fileUrl) => {
    let fileName = fileUrl.split("/").pop().split(".")[0];
    fileName = fileName.replace(/^\d+-|^\d+$/g, "");
    fileName = removeAccents(fileName);
    fileName = fileName.replace(/[-\s]+/g, " ").trim();
    return fileName;
  };

  const renderFileMessage = (fileUrl, isSender) => {
    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    const fileName = cleanFileName(fileUrl);

    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      return (
        <img
          src={fileUrl}
          alt="shared file"
          className="max-w-full max-h-40 cursor-pointer"
          onClick={() => window.open(fileUrl, "_blank")}
        />
      );
    } else if (fileExtension === "pdf") {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white underline" : "text-blue-600 underline"}`}
        >
          {fileName}.pdf
        </a>
      );
    } else if (["mp3", "wav"].includes(fileExtension)) {
      return (
        <audio controls className="max-w-full">
          <source src={fileUrl} type={`audio/${fileExtension}`} />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (["docx", "pptx", "xlsx", "txt", "odt"].includes(fileExtension)) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white underline" : "text-blue-600 underline"}`}
        >
          {fileName}.{fileExtension}
        </a>
      );
    } else {
      return (
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white underline" : "text-blue-600 underline"}`}
        >
          {fileUrl}
        </a>
      );
    }
  };

  return {
    formatMessageWithLinks,
    formatTimestamp,
    renderFileMessage,
  };
};

export default useMessageFormatter;