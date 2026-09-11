import { useState, useEffect } from "react";
import constants, {
  buildPresenceChecklist,
  METRIC_CONFIG,
} from "../constants.js";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


function App()
{
  const [aiReady, setAiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [presenceChecklist, setPresenceChecklist] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.puter?.ai?.chat) {
        clearInterval(interval);
        setAiReady(true);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);


  const extractPDFText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const texts = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) => pdf.
      getPage(i + 1).then(
        (page) => 
          page
           .getTextContent()
           .then((tc) => tc.items.map((i) => i.str).join(' '))
    ))
   );
  
    return texts.join("\n").trim();
  };

  const parseJSONResponse = (reply) => {
    try {
      
      const match = reply.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : null;
      if(!parsed.overallScore && !parsed.error){
        throw new Error("Invalid AI response");
      }
      return parsed;
    } catch (err) {
      throw new Error(`Failed to parse AI response: ${err.message}`);
    }
  };
 

  const analyzeResume = async (text) => {
    const prompt = constants.ANALYZE_RESUME_PROMPT.replace("{{DOCUMENT_TEXT}}", text);
    const response = await window.puter.ai.chat([
      { role: "system", content: "You are an expert resume reviewer...." },
      {role: "user", content: prompt},
      ],
      {
        model: "gpt-4o",
      }
    );
    const result = parseJSONResponse(
      typeof response === "string" ? response :response.
      message?.content || ""
    );
    if (result.error) throw new Error(result.error);
    return result;
  };

  const handleFileUpload = async (event) =>
{
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf")
     {
      return alert("Please upload a PDF file only.");
    }
    setUploadedFile(file);
    setIsLoading(true);
    setAnalysis(null);
    setResumeText("");
    setPresenceChecklist([]);

    try {
      const text = await extractPDFText(file);
      setResumeText(text);
      setPresenceChecklist(buildPresenceChecklist(text));
      setAnalysis(await analyzeResume(text));

    }catch (error) {
      alert(`Error: ${error.message}`);
      reset();

    }finally {
      setIsLoading(false);
    }
};
   
  function reset() {
    setUploadedFile(null);
    setAnalysis(null);
    setResumeText("");
    setPresenceChecklist([]);
  }

  return (
    <div className="min-h-screen bg-main-gradient p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      
      <div className="max-w-5xl max-auto w-full">

        <div className="text-center mb-6">
          <h1 claasName="text-5xl sm:text-6xl lg:text-7xl font-light bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-300 bg-clip-text text-transparent mb-2">AI Resume Analyzer</h1>
          <p className="text-slate-300 text-sm sm:text-base">Upload your PDF resume and get instant AI feedback</p>
        </div> 


        {!uploadedFile && (
          <div className="upload-area">

          <div className="upload-zone">

            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4"></div>
            <h3 className="text-xl sm:text-2xl text-slate-200 mb-2">
                  Upload Your Resume
            </h3>
            <p className ="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">PDF files only . Get instant analysis
            </p>     

            <input type="file"
            accept="pdf"
            onChange={handleFileUpload}
            disabled={!aiReady}
            className="hidden"
            id="file-upload"
          />
            <label 
              htmlFor="file-upload"
              className={`inline-block btn-primary ${
                !aiReady ? "opacity-50 cursor-not-allowed" : ""
              }` }     
           >
               Choose PDF File
             </label>  
           </div>
        </div>
      )}

     {isLoading && (
     <div className="p-6 sm:p-8 max-w-md mx-auto">
       <div className="text-center">
          <div className="loading-spinner"></div>
          <h3 className="text-lg sm:text-xl text-slate-200 mb-2">Analyzing Your Resume</h3>
          <p className="text-slate-400 text-sm sm:text-base">Please wait while AI reviews your resume...</p>
         </div>
      </div>
                )}
               {analysis && uploadedFile && (
               <div className="space-y-6 p-4 sm:px-8 lg:px-16">
                <div className="file-info-card">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="icon-container-x1 bg-gradient-to-br☐ from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                  <span className="text-3xl"></span>
                  </div>
                 <div>
                <h3 className="text-xl font-bold text-green-500 mb-1">Analysis Complete</h3>
                <p className="text-slate-300 text-sm break-all">
                  {uploadedFile.name }
                  </p>
                </div>
              </div>
             <div className="flex gap-3">
             <button onClick={reset}
             className="btn-secondary">
             New Analysis
           </button>
          </div>
         </div>
        </div>
      </div>
       )}
      </div>
    </div>
  );
}

export default App;