import { useContext } from "react";
import HomeAnalysisContext from "../contexts/HomeAnalysisProvider";
function TextFileUpload() {
    const { setText } = useContext(HomeAnalysisContext);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            setText(event.target.result)
        };

        reader.onerror = (err) => {
            console.error("Error reading file:", err);
        };

        reader.readAsText(file);
    }

  return (
    <label 
        htmlFor="uploadFile1"
        className="flex hover:bg-gray-400 text-black dark:text-white text-base font-medium px-4 py-2.5 outline-none rounded w-max cursor-pointer"
    > 
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-6 mr-2 fill-black dark:fill-white inline" 
            viewBox="0 0 32 32"
        >
            <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000" 
            />
            <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000" 
            />
        </svg>
        Upload
        <input 
            type="file"
            id='uploadFile1' 
            className="hidden" 
            accept=".txt"
            onChange={handleFileUpload}
        />
    </label>
  );
}

export default TextFileUpload;