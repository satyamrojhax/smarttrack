
import React, { useState, useEffect } from 'react';
import { ConversationSidebar } from './ConversationSidebar';
import { ChatWindow } from './ChatWindow';
import { useConversations } from '@/hooks/useConversations';
import { useIsMobile } from '@/hooks/use-mobile';

export const ChatInterface = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { conversations, createNewConversation, loading, deleteConversation } = useConversations();
  const isMobile = useIsMobile();

  const handleNewChat = async () => {
    const newConversation = await createNewConversation();
    if (newConversation) {
      setSelectedConversationId(newConversation.id);
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    await deleteConversation(conversationId);
    if (selectedConversationId === conversationId) {
      setSelectedConversationId(null);
    }
  };

  // Auto-select first conversation or create new one
  useEffect(() => {
    if (!loading && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    } else if (!loading && conversations.length === 0 && !selectedConversationId) {
      handleNewChat();
    }
  }, [conversations, loading, selectedConversationId]);

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex h-full bg-background relative">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'w-80 z-50' : 'w-64'} 
        transition-transform duration-300 h-full border-r bg-background
      `}>
        <ConversationSidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          loading={loading}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          conversationId={selectedConversationId}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
};
