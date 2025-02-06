import { FC } from 'react';
import { Loader, LoaderCircle, UserRound } from 'lucide-react';
import Message from '@/components/messages/Message.tsx';
import useGetMessages from '@/hooks/useGetMessages.tsx';

interface Props {
  id: string;
}

const MessagesList: FC<Props> = ({id}) => {
  const {sortedMessages, loading} = useGetMessages();
  return (
    <div className="w-full flex flex-col">
      <div className="h-[60px] px-[16px] bg-light-gray flex items-center">
        <UserRound size={40} color="#5c5c5c"/>
        <p className="ml-3">{id}</p>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-5 py-4 flex flex-col-reverse">
        {
          loading ?
            <div className="h-full flex items-center justify-center">
              <Loader size={60} className="animate-spin"/>
            </div>
            :
            sortedMessages.map((msg) => (
              <Message msg={msg} incoming={msg.type === 'incoming'} key={msg.idMessage}/>
            ))
        }
      </div>
    </div>
  );
};

export default MessagesList;