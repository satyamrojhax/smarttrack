
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
      setIsSidebarOpen(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsSidebarOpen(false);
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

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Smaller width, completely hidden when closed */}
      <div className={`
        ${isMobile ? 'fixed' : 'fixed'} 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        ${isMobile ? 'w-[280px]' : 'w-[320px]'} 
        transition-transform duration-300 ease-in-out
        h-full bg-background border-r z-50 flex-shrink-0 shadow-xl
      `}>
        <ConversationSidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          loading={loading}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area - Always full width */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <ChatWindow
          conversationId={selectedConversationId}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
};
