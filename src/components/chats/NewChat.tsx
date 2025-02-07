import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageSquarePlus } from 'lucide-react';
import useNewChat from '@/hooks/useNewChat.tsx';
import useGetMessages from '@/hooks/useGetMessages.tsx';
import { useState } from 'react';
import useChatsHistory from '@/hooks/useChatsHistory.tsx';

export function NewChat() {
  const [isOpen, setIsOpen] = useState(false);
  const {handleChange, formData} = useNewChat();
  const {getMessages} = useChatsHistory();
  const {sendMessage} = useGetMessages();

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage(formData.phoneNumber + '@c.us', formData.message);
    setIsOpen(false);
    getMessages();
  }
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <MessageSquarePlus size={30} color="#5c5c5c" className="active:opacity-[0.8] hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New chat</DialogTitle>
            <DialogDescription>
              Create new chat.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone number
              </Label>
              <Input id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="col-span-3"
                     placeholder="Phone number(no symbols)"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Input id="message" value={formData.message} onChange={handleChange} className="col-span-3"
                     placeholder="Enter your message"/>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Send</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}