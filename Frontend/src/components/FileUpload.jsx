import React from 'react';

const FileUpload = ({ setFile, file }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-50 border-b border-slate-100">
      <label className="cursor-pointer bg-white border border-slate-200 px-3 py-1 rounded-md text-xs hover:bg-slate-100 transition">
        {file ? "📄 " + file.name : "📎 Upload Resume (PDF)"}
        <input 
          type="file" 
          className="hidden" 
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])} 
        />
      </label>
      {file && <button onClick={() => setFile(null)} className="text-red-500 text-xs">Remove</button>}
    </div>
  );
};

export default FileUpload;