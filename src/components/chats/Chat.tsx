import { FC } from 'react';
import * as dayjs from 'dayjs';
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat: FC = ({timestamp, senderName, textMessage, chatId, id}) => {
  const navigate = useNavigate();
  const time = dayjs.unix(timestamp).format('HH:mm');
  const chatIdNumber = chatId.replace(/\D/g, "")
  const bg = id === chatId ? 'bg-gray-cover' : '';

  return (
    <div className={`w-full min-h-[72px] flex items-center pl-[13px] ${bg} hover:bg-gray-cover cursor-pointer`}
         onClick={() => navigate(`/chat/${chatId}`)}>
      <div className="w-[49px] h-[49px] rounded-full">
        <UserRound size={40} color="#5c5c5c"/>
      </div>
      <div className="pl-[15px] pt-[10px] pr-[13px] flex-1 border-b-[1px] border-gray-300 min-h-[72px]">
        <p className="text-[14px] flex justify-between">
          {chatIdNumber} <span>{time}</span>
        </p>
        <span className="text-[10px] truncate">{textMessage}</span>
      </div>
    </div>
  );
};

export default Chat;