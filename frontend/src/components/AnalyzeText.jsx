import { useContext } from "react";
import HomeAnalysisContext from "../contexts/HomeAnalysisProvider";

function AnalyzeTextButton() {
  const { text, setLoading, setResult, loading } = useContext(HomeAnalysisContext);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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