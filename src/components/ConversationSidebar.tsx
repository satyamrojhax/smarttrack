
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageCircle, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

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
  onDeleteConversation: (id: string) => void;
  loading: boolean;
  onClose?: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  loading,
  onClose
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const handleDelete = (conversationId: string) => {
    onDeleteConversation(conversationId);
    setDeleteDialogOpen(null);
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Header with close button for all devices */}
      <div className="flex items-center justify-between p-3 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold">Chat History</h2>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8 hover:bg-secondary"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-3 flex-shrink-0">
        <Button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90 text-sm"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-3 overflow-hidden">
        <div className="space-y-1 pb-3">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`
                group relative rounded-lg p-3 hover:bg-secondary/50 cursor-pointer transition-colors
                ${selectedConversationId === conversation.id ? 'bg-secondary' : ''}
              `}
            >
              <div
                className="pr-8"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <MessageCircle className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm font-medium">
                    {conversation.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                </span>
              </div>

              {/* Delete Button */}
              <AlertDialog open={deleteDialogOpen === conversation.id} onOpenChange={(open) => setDeleteDialogOpen(open ? conversation.id : null)}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%] max-w-md mx-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this conversation? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(conversation.id)}
                      className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          
          {conversations.length === 0 && !loading && (
            <div className="text-center text-muted-foreground text-sm p-6">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No conversations yet.</p>
              <p className="text-xs mt-1">Start a new chat!</p>
            </div>
          )}

          {loading && (
            <div className="text-center text-muted-foreground text-sm p-6">
              <div className="animate-pulse">Loading conversations...</div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
