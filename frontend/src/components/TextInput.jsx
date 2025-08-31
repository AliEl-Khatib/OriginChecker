import AnalyzeTextButton from "./AnalyzeText";
import TextFileUpload from "./TextFileUpload";
import { useContext } from "react";
import HomeAnalysisContext from "../contexts/HomeAnalysisProvider";
function TextInput() {
    const { text, setText, loading } = useContext(HomeAnalysisContext);

    const handleInput = (e) => {
        setText(e.target.value);
    }

   return (
        <>
            <div className="h-full px-4 py-2 bg-[#F5F3F6] rounded-b-lg dark:bg-gray-800">
                <label htmlFor="editor" className="sr-only"></label>
                <textarea
                    id="editor"
                    rows="8" 
                    className="block w-full px-0 text-sm text-gray-800 bg-[#F5F3F6] border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 focus:outline-none resize-none" 
                    placeholder="Input text here" 
                    required 
                    disabled={loading}
                    value={text}
                    onChange={handleInput}
                />  
            </div>
            <div className="flex justify-end space-x-10 rtl:space-x-reverse sm:pe-4 px-6 py-2">
                <TextFileUpload/>
                <AnalyzeTextButton/>
            </div>
        </>
    )
}

export default TextInput