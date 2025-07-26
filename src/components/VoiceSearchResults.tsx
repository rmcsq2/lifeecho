'use client';

import React from 'react';
import { VoiceNote } from '../types/VoiceNote';
import { formatNoteTimestamp } from '../utils/voiceNoteStorage';

interface VoiceSearchResultsProps {
  searchResults: VoiceNote[];
  searchTerm: string;
  searchType: 'last' | 'all';
  onClose: () => void;
  onPlayback?: (note: VoiceNote) => void;
}

export const VoiceSearchResults: React.FC<VoiceSearchResultsProps> = ({
  searchResults,
  searchTerm,
  searchType,
  onClose,
  onPlayback
}) => {
  const highlightSearchTerm = (text: string, term: string): React.ReactNode => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  const getPreviewText = (text: string, maxLength: number = 200): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDateHeader = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const groupNotesByDate = (notes: VoiceNote[]) => {
    const groups: { [key: string]: VoiceNote[] } = {};
    
    notes.forEach(note => {
      const dateKey = new Date(note.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(note);
    });
    
    return groups;
  };

  const noteGroups = groupNotesByDate(searchResults);
  const sortedDateKeys = Object.keys(noteGroups).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {searchType === 'last' ? 'Last mention of' : 'All mentions of'} &quot;{searchTerm}&quot;
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-behavior-y-contain" style={{ scrollBehavior: 'smooth' }}>
          {searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg font-medium">No results found</p>
                <p className="text-sm mt-1">
                  No voice notes contain &quot;{searchTerm}&quot;
                </p>
              </div>
            </div>
          ) : (
            <div className="px-6 py-4">
              {sortedDateKeys.map((dateKey, groupIndex) => (
                <div key={dateKey}>
                  <div className="sticky top-0 bg-white dark:bg-gray-800 py-2 mb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      {formatDateHeader(noteGroups[dateKey][0].timestamp)}
                    </h3>
                  </div>
                  
                  {noteGroups[dateKey].map((note, noteIndex) => {
                    const { time } = formatNoteTimestamp(note.timestamp);
                    const isLastInGroup = noteIndex === noteGroups[dateKey].length - 1;
                    
                    return (
                      <div key={note.id} className="mb-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 text-right min-w-[60px]">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {time}
                            </span>
                            {onPlayback && (
                              <button
                                onClick={() => onPlayback(note)}
                                className="block mt-1 p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                                title="Play back note"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {note.title && (
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                                {note.title}
                              </h4>
                            )}
                            
                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {highlightSearchTerm(getPreviewText(note.text), searchTerm)}
                            </div>
                            
                            {note.latitude && note.longitude && (
                              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                Location recorded
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {!isLastInGroup && (
                          <div className="mt-4 border-b border-gray-100 dark:border-gray-700"></div>
                        )}
                      </div>
                    );
                  })}
                  
                  {groupIndex < sortedDateKeys.length - 1 && (
                    <div className="mb-6 border-b-2 border-gray-200 dark:border-gray-600"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {searchResults.length > 0 && (
              <>
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} • 
                Scroll to view all entries
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
