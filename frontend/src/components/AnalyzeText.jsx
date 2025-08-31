import { useContext } from "react";
import HomeAnalysisContext from "../contexts/HomeAnalysisProvider";

function AnalyzeTextButton() {
    const { text, setLoading, setResult, loading } = useContext(HomeAnalysisContext);

    // Mock Api call too simulate network delay
    const handleAnalyze = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);

            //Randomize probability since this is mocked
            const percentageAi = Math.floor(Math.random() * 101);
            let headline = "";

            if (percentageAi > 70) headline = "Your document is most likely AI-generated.";
            else if (percentageAi > 40) headline = "Your document may contain some AI-generated content.";
            else headline = "Your document is likely written by a human.";

            //Randomize which sentences are highlighted since this is mocked
            const sentencesArray = text.split(/(?<=[.!?])\s+/).filter(Boolean);
            const numAiSentences = Math.round((percentageAi / 100) * sentencesArray.length);
            const shuffled = [...sentencesArray].sort(() => Math.random() - 0.5);

            const resultSentences = sentencesArray.map((sentence) => {
                const isAi = shuffled.indexOf(sentence) < numAiSentences;
                const prob = isAi ? Math.random() * 0.4 + 0.2 : Math.random() * 0.3 + 0.7;
                return { text: sentence, prob };
            });
            
            //Return json result
            setResult({
                headline,
                percentageAi,
                sentences: resultSentences,
        });
    }, 3000);
    
  };

  return (
    <button
      onClick={handleAnalyze}
      className="bg-[#3A9D9D] text-white px-5 py-2 rounded-lg hover:bg-[#2C7A7A] cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 transition-colors duration-200 shadow-md"
      disabled={!text.trim() || loading}
    >
      Analyze Text
    </button>
  );
}

export default AnalyzeTextButton;