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
import { Loader, MessageSquarePlus } from 'lucide-react';
import useNewChat from '@/hooks/useNewChat.ts';

export function NewChat() {
  const {
    handleChange, formData,
    onSubmit, loading, isOpen, setIsOpen
  } = useNewChat();

  return (
    <Dialog open={isOpen} modal={isOpen} >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <MessageSquarePlus size={30} color="#5c5c5c" className="active:opacity-[0.8] hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => onSubmit(e, formData)}>
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
            <Button type="submit">Send
              {loading && <Loader size={5} className="animate-spin"/>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}