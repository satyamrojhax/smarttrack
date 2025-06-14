
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  loading: boolean;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewChat,
  loading
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant={selectedConversationId === conversation.id ? "secondary" : "ghost"}
              className="w-full justify-start p-3 h-auto flex-col items-start text-left hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-sm font-medium">
                  {conversation.title}
                </span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
              </span>
            </Button>
          ))}
          
          {conversations.length === 0 && !loading && (
            <div className="text-center text-muted-foreground text-sm p-4">
              No conversations yet.
              Start a new chat!
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
