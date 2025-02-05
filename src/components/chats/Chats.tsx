import { MessageSquarePlus } from 'lucide-react';
import Chat from '@/components/chats/Chat.tsx';
import useChatHistory from '@/hooks/useChatHistory.tsx';

const Chats = () => {
  const {groupedMessages} = useChatHistory();
  return (
    <div className="w-[40%] bg-white h-screen overflow-y-auto scroll-smooth">
      <div className="flex items-center justify-between px-[16px] py-[14px]">
        <h1 className="text-2xl font-bold">Chats</h1>
        <MessageSquarePlus size={30} color="#5c5c5c" className="active:opacity-[0.8] hover:cursor-pointer"/>
      </div>

      {Object.keys(groupedMessages).map((chatId) => (
        <Chat key={groupedMessages[chatId].idMessage} {...groupedMessages[chatId]}/>
      ))}
    </div>
  );
};

export default Chats;