import { LoaderCircle, MessageSquarePlus } from 'lucide-react';
import Chat from '@/components/chats/Chat.tsx';
import useChatHistory from '@/hooks/useChats.tsx';
import { FC } from 'react';

interface Props {
  id?: string;
}

const Chats: FC<Props> = ({id}) => {
  const {groupedMessages, loading} = useChatHistory();
  return (
    <div className="w-[40%] bg-white flex flex-col">
      <div className="flex items-center justify-between px-[16px] h-[60px] bg-light-gray border-r-2">
        <h1 className="text-2xl font-bold">Chats</h1>
        <MessageSquarePlus size={30} color="#5c5c5c" className="active:opacity-[0.8] hover:cursor-pointer"/>
      </div>
      <>
        {
          loading ?
            <div className="h-full flex items-center justify-center">
              <LoaderCircle size={80} className="animate-spin"/>
            </div>
            :
            <div className="flex-1 overflow-y-auto scroll-smooth">
              {Object.keys(groupedMessages).map((chatId) => (
                <Chat key={groupedMessages[chatId].idMessage} {...groupedMessages[chatId]} id={id}/>
              ))}
            </div>
        }
      </>
    </div>

  );
};

export default Chats;