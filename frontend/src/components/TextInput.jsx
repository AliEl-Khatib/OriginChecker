import { useState } from "react";


function TextInput( {loading, setLoading, setResult}) {
    const [text, setText] = useState("");
    


    const handleInput = (e) => {
        setText(e.target.value);
    }

    const handleAnalyze = () => {
        setLoading(true); 
        setTimeout(() => {
            setLoading(false); 

            const  percentageAi = Math.floor(Math.random() * 101);
            let headline = ""

            // Determine what headline to use based on percentageAi
            if (percentageAi > 70) {
                headline = "Your document is most likely AI-generated.";
            } else if (percentageAi > 40) {
                headline = "Your document may contain some AI-generated content.";
            } else {
                headline = "Your document is likely written by a human.";
            }

            const sentencesArray = text.split(/(?<=[.!?])\s+/).filter(Boolean);
            const numAiSentences = Math.round((percentageAi / 100) * sentencesArray.length);
            const shuffled = [...sentencesArray].sort(() => Math.random() - 0.5);

            const resultSentences = sentencesArray.map((sentence) => {
            const isAi = shuffled.indexOf(sentence) < numAiSentences;

            
            const prob = isAi 
                ? Math.random() * 0.4 + 0.2 
                : Math.random() * 0.3 + 0.7;  

            return {
                text: sentence,
                prob,
            };
            });
            setResult({
                headline,
                percentageAi,
                sentences: resultSentences
            });
        }, 3000);

    };


   return (
        <div className="w-full max-w-5xl mx-auto mb-4 border-4 border-[#9BAEC4]/10 rounded-lg bg-[#9BAEC4] dark:bg-gray-700 dark:border-gray-600">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!text.trim()) return;
                    setLoading(true);
                    setTimeout(() => setLoading(false), 3000);
                }}
            >
                <div className="h-full px-4 py-2 bg-[#F5F3F6] rounded-b-lg dark:bg-gray-800">
                    <label htmlFor="editor" className="sr-only"></label>
                    <textarea
                        id="editor"
                        rows="8" 
                        className="block w-full px-0 text-sm text-gray-800 bg-[#F5F3F6] border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400 focus:outline-none" 
                        placeholder="Input text here" 
                        required 
                        disabled={loading}
                        onChange={handleInput}
                    />  
                </div>
                <div className="flex justify-end space-x-1 rtl:space-x-reverse sm:pe-4 px-6 py-2">
                    <button 
                        onClick={handleAnalyze} 
                        className="bg-[#3A9D9D] text-white px-5 py-2 rounded-lg 
                            hover:bg-[#2C7A7A] cursor-pointer
                            disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400
                            transition-colors duration-200 shadow-md" 
                        disabled={!text.trim() || loading}
                        
                    >
                        Analyze Text
                    </button>
                </div>
            </form>
        </div>

    )
}

export default TextInput