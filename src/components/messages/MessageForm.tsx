import { useState } from 'react';
import { Input } from '@/components/ui/input.tsx';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';

const MessageForm = ({onSend, id}) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== '') {
      onSend(id, message);
      setMessage('');
    }
  };
  return (
    <div className="w-full min-h-[62px] bg-light-gray ">
      <form onSubmit={handleSubmit} className="w-full h-full flex items-center px-10">
        <Input value={message} onChange={handleChange}
               className="flex-1 bg-white min-h-[44px]" placeholder="Enter message"/>
        <Button className="ml-3 text-white bg-transparent
        shadow-transparent p-0 hover:bg-transparent border-transparent" type="submit">
          <Send style={{width: 32, height: 32}}/>
        </Button>
      </form>
    </div>
  );
};

export default MessageForm;