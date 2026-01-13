import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Upload, FileText, Search, MoreVertical, Plus, Folder, Clock, User, Download, Trash2, Eye, Share2 } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Document Card Component
function DocumentCard({ document, onView, onDownload, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 truncate">{document.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {document.type} • {document.size}
            </p>
            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {document.date}
              </span>
              <span>Uploaded by {document.uploader}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border hidden">
            <button onClick={onView} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center">
              <Eye className="h-4 w-4 mr-2" /> View
            </button>
            <button onClick={onDownload} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center">
              <Download className="h-4 w-4 mr-2" /> Download
            </button>
            <button onClick={onDelete} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 flex items-center">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
        <button onClick={onView} className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center">
          <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
        </button>
        <button onClick={() => {/* Share functionality */}} className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center">
          <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
        </button>
      </div>
    </div>
  );
}

// Upload Modal Component
function UploadModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onUpload(response.data);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Upload Document</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="p-4 bg-blue-50 rounded-full inline-block mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-2">
              {file ? file.name : 'Drag & drop your file here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <label className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg cursor-pointer transition">
              Browse Files
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
            </label>
            <p className="text-xs text-gray-500 mt-4">
              Supports PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
            </p>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Replace with actual API call
        // const response = await axios.get(`${API_BASE_URL}/documents`);
        
        // Mock data for demonstration
        setTimeout(() => {
          setDocuments([
            {
              id: 1,
              name: 'Quarterly_Report_Q4_2023.pdf',
              type: 'PDF',
              size: '2.4 MB',
              date: 'Dec 15, 2023',
              uploader: 'John Doe'
            },
            {
              id: 2,
              name: 'Project_Proposal.docx',
              type: 'DOCX',
              size: '1.8 MB',
              date: 'Dec 12, 2023',
              uploader: 'Jane Smith'
            },
            {
              id: 3,
              name: 'Meeting_Minutes.txt',
              type: 'TXT',
              size: '45 KB',
              date: 'Dec 10, 2023',
              uploader: 'Mike Johnson'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDocumentUpload = (newDocument) => {
    setDocuments([newDocument, ...documents]);
  };
  
  const handleDocumentDelete = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== documentId));
      // Add API call to delete from backend
    }
  };
  
  const handleDocumentView = (document) => {
    // Navigate to document view page or open preview
    console.log('Viewing document:', document);
  };
  
  const handleDocumentDownload = (document) => {
    // Implement download functionality
    console.log('Downloading document:', document);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DocuScope AI</h1>
                <p className="text-sm text-gray-600">Smart Document Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome to DocuScope AI!</h2>
              <p className="text-indigo-100">
                Your intelligent document assistant. Upload, analyze, and chat with your documents.
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-300" />
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <Folder className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">4.2 MB</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Uploads</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <User className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
        
        {/* Document Section */}
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your Documents</h3>
                <p className="text-gray-600 mt-1">Manage and analyze your uploaded documents</p>
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Upload
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your documents...</p>
                </div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full inline-block mb-4">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No documents found' : 'No documents yet'}
                </h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Upload your first document to start analyzing with AI'}
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg flex items-center mx-auto"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Your First Document
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onView={() => handleDocumentView(doc)}
                    onDownload={() => handleDocumentDownload(doc)}
                    onDelete={() => handleDocumentDelete(doc.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/chat')}
              className="p-6 border border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-colors text-left"
            >
              <div className="p-3 bg-indigo-100 rounded-lg inline-block mb-4">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Chat with Documents</h4>
              <p className="text-sm text-gray-600">Ask questions and get insights from your documents</p>
            </button>
            <button className="p-6 border border-gray-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition-colors text-left">
              <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Analyze Documents</h4>
              <p className="text-sm text-gray-600">Get AI-powered analysis and summaries</p>
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="p-6 border border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-colors text-left"
            >
              <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Batch Upload</h4>
              <p className="text-sm text-gray-600">Upload multiple documents at once</p>
            </button>
          </div>
        </div>
      </main>
      
      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleDocumentUpload}
      />
    </div>
  );
}

export default Dashboard;