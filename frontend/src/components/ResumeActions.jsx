import React from 'react';

const ResumeActions = ({ resumeUrl, fileName }) => {
  const handleView = () => {
    if (!resumeUrl) {
      alert("Resume not available");
      return;
    }
    window.open(resumeUrl, '_blank');
  };

  const handleDownload = () => {
    if (!resumeUrl) {
      alert("Cannot download: resume not available");
      return;
    }
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button 
        onClick={handleView}
        style={{
          padding: '4px 12px',
          background: '#2c7da0',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        👁️ View
      </button>
      <button 
        onClick={handleDownload}
        style={{
          padding: '4px 12px',
          background: '#2c6e4f',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ⬇️ Download
      </button>
    </div>
  );
};

export default ResumeActions;