import React, { Component } from "react";
import ReactDOM from "react-dom";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { create as createFilePond } from 'filepond';

// Create a FilePond instance on a specified DOM element
const inputElement = document.querySelector('input[type="file"]');
const pond = createFilePond(inputElement);

// Set some options on the FilePond instance
pond.setOptions({
    server: 'your-endpoint-here',
    maxFiles: 3
});

// Listen for FilePond events
pond.on('addfile', (error, file) => {
    if (error) {
        console.error('Error adding file:', error);
    } else {
        console.log('File added:', file);
    }
});


// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Define types for the state
interface FileUploadProps {
  onProcessFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// FileUpload component definition
const FileUpload: React.FC<FileUploadProps> = ({ onProcessFiles }) => {
  return (
    <div>
      <label htmlFor="fileInput" className="button">
        Upload Files
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={onProcessFiles}
        style={{ display: 'none' }} // Hide the input element
        multiple // Allow multiple file uploads
      />
    </div>
  );
};

export default FileUpload;
