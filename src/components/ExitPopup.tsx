
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ExitPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ExitPopup: React.FC<ExitPopupProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to leave?</DialogTitle>
          <DialogDescription>
            Your progress might be lost if you leave now. Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Stay
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="w-full sm:w-auto">
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExitPopup;
