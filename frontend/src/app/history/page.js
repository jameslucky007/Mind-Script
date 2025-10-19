"use client"
import { useAuth } from '@/firebase/useAuth';
import React, { useEffect, useState } from 'react'
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Share2, Calendar, User, Trash2, AlertTriangle } from 'lucide-react';

const page = () => {
 const user = useAuth();
 const [data,setData] = useState([])
 const [errorMsg, setErrorMsg] = useState('')
 const [deleteLoading, setDeleteLoading] = useState(null)
 const [showDeleteModal, setShowDeleteModal] = useState(null)

  useEffect(()=>{
    if(user?.email){
      
      const getMyHistoryHandler = async(email) =>{
    try {
      const res = await fetch(`http://localhost:14000/myhistory/${email}`)
      const result = await res.json()
      
      if(res.ok) {
        console.log(result.history);
        setErrorMsg('')
        
        // Sort the history data by date/time in descending order (most recent first)
        const sortedHistory = result.history.sort((a, b) => {
          // If your API returns a timestamp field, use that
          if (a.timestamp && b.timestamp) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          }
          // If your API returns a createdAt field, use that
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          // If your API returns a date field, use that
          if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
          }
          // If your API returns an id that's incrementing, use that (higher id = more recent)
          if (a.id && b.id) {
            return b.id - a.id;
          }
          // Fallback: maintain original order
          return 0;
        });
        
        setData(sortedHistory)
      } else {
        setErrorMsg(result.message)
      }

    } catch (error) {
      console.log(error);
      setErrorMsg('Failed to fetch history')
    }
  }

  getMyHistoryHandler(user.email)
    }
  },[user])

  const handleShare = async (item) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.history.substring(0, 100) + '...',
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${item.title}\n\n${item.history}`);
        alert('Content copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleDelete = async (itemId, index) => {
    setDeleteLoading(index);
    try {
      // Replace with your actual delete endpoint
      const res = await fetch(`http://localhost:14000/deletehistory/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        // You might need to send user email or other auth data
        body: JSON.stringify({ email: user?.email })
      });

      if (res.ok) {
        // Remove the item from local state
        setData(prevData => prevData.filter((_, i) => i !== index));
        setShowDeleteModal(null);
      } else {
        const result = await res.json();
        alert(result.message || 'Failed to delete item');
      }
    } catch (error) {
      console.log('Delete error:', error);
      alert('Failed to delete item');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Function to format the date display
  const formatDate = (item) => {
    // Check for various date field names your API might use
    const dateValue = item.timestamp || item.createdAt || item.date || item.updatedAt;
    
    if (dateValue) {
      const date = new Date(dateValue);
      // Check if it's a valid date
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
    
    // Fallback to current date if no valid date found
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const DeleteConfirmModal = ({ item, index, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#2A3441] rounded-2xl border border-white/20 shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className="bg-red-500/20 rounded-full p-2 mr-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Delete Item</h3>
        </div>
        
        <p className="text-white/70 mb-6">
          Are you sure you want to delete "{item.title}"? This action cannot be undone.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item.id || index, index)}
            disabled={deleteLoading === index}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {deleteLoading === index ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (data.length === 0 && !errorMsg) {
    return (
      <div className="min-h-screen bg-[#1E2939] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E2939] p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Your History
          </h1>
          <p className="text-white/60">Browse through your saved content (most recent first)</p>
        </div>

        {data.length > 0 ? (
          <div className="space-y-6">
            {data.map((item, index) => (
              <div key={item.id || index} className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden group hover:bg-white/10 transition-all duration-300">
                {/* Card Header */}
                <div className="p-6 pb-4 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                        {item.title}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-white/50">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>You</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 text-white/90 leading-relaxed">
                  <div className="prose prose-invert max-w-none">
                    <MarkdownRenderer content={item.history} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteModal({ item, index })}
                    className="group/btn bg-red-600 hover:bg-red-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-red-500/25"
                    title="Delete this content"
                  >
                    <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                  </button>
                  
                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(item)}
                    className="group/btn bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-blue-500/25"
                    title="Share this content"
                  >
                    <Share2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-200" />
                  </button>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl max-w-md mx-auto">
              <div className="text-white/60 mb-4">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No History Found</h3>
              <p className="text-white/70">
                {errorMsg || "You haven't created any content yet. Start exploring to build your history!"}
              </p>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <DeleteConfirmModal
            item={showDeleteModal.item}
            index={showDeleteModal.index}
            onClose={() => setShowDeleteModal(null)}
            onConfirm={handleDelete}
          />
        )}

        {/* Floating particles animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-blue-600 rounded-full animate-bounce opacity-20"></div>
          <div className="absolute top-1/6 right-1/6 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse opacity-25"></div>
          <div className="absolute bottom-1/4 left-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping opacity-15"></div>
        </div>
      </div>
    </div>
  )
}

export default page