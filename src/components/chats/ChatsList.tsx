import { LoaderCircle, LogOut } from 'lucide-react';
import Chat from '@/components/chats/Chat.tsx';
import useChatHistory from '@/hooks/useChatsHistory.tsx';
import { FC } from 'react';
import { useAppContext } from '@/contexts/AppContext.tsx';
import { NewChat } from '@/components/chats/NewChat.tsx';

interface Props {
  id?: string;
}

const ChatsList: FC<Props> = ({id}) => {
  const {logOut} = useAppContext();
  const {groupedMessages, loading,find } = useChatHistory();
  return (
    <div className="max-w-[30%] w-[30%] bg-white flex flex-col truncate">
      <div className="flex items-center justify-between px-[16px] h-[60px] bg-light-gray border-r-2">
        <h1 className="text-2xl font-bold">Chats</h1>
        <div className="flex">
          <NewChat/>
          <LogOut className="ml-4 text-gray-800" onClick={logOut}/>
        </div>
      </div>
      <>
        {
          loading ?
            <div className="h-full flex items-center justify-center">
              <LoaderCircle size={80} className="animate-spin"/>
            </div>
            :
            <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
              {Object.keys(groupedMessages).map((chatId) => (
                <Chat key={groupedMessages[chatId].idMessage} {...groupedMessages[chatId]} id={id}/>
              ))}
            </div>
        }
      </>
    </div>

  );
};

export default ChatsList;