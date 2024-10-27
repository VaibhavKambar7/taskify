import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  enhancedText: string;
  onConfirm: (text: string) => void;
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  originalText,
  enhancedText,
  onConfirm,
}: ConfirmationDialogProps) => {
  const [editedText, setEditedText] = useState(enhancedText);

  useEffect(() => {
    setEditedText(enhancedText);
  }, [enhancedText]);

  const handleConfirm = () => {
    onConfirm(editedText);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review AI Enhanced Description</DialogTitle>
          <DialogDescription>
            You can accept the AI suggestion as-is or modify it before applying.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Original Description:</h4>
            <div className="border rounded-md p-3 text-sm bg-gray-50">
              {originalText || "Empty description"}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Enhanced Description:</h4>
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[100px] bg-blue-50"
              placeholder="Edit the enhanced description here..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
