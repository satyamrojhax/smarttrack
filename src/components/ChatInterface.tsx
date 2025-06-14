
import React, { useState, useEffect } from 'react';
import { ConversationSidebar } from './ConversationSidebar';
import { ChatWindow } from './ChatWindow';
import { useConversations } from '@/hooks/useConversations';

export const ChatInterface = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { conversations, createNewConversation, loading } = useConversations();

  const handleNewChat = async () => {
    const newConversation = await createNewConversation();
    if (newConversation) {
      setSelectedConversationId(newConversation.id);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
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
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r`}>
        <ConversationSidebar
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          loading={loading}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow
          conversationId={selectedConversationId}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
};
