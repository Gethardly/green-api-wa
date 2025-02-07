import { FC } from 'react';
import * as dayjs from 'dayjs';

interface Props {
  incoming: boolean;
  msg: any;
}

const Message: FC<Props> = ({incoming, msg}) => {
  const time = dayjs.unix(msg.timestamp).format('HH:mm');

  return (
    <div className="flex flex-col my-[3px]">
      <div
        className={`${incoming ? 'bg-white' : 'bg-outgoing-message'} ${!incoming && 'self-end'} max-w-[45%] 
        w-auto rounded-[7.5px] p-3`}>
        <p className="text-[16px] break-words pb-1 pr-[35px]">
          {msg.textMessage ? msg.textMessage : msg.typeMessage}
        </p>
        <div className="flex justify-end">
          <span className="text-sm text-gray-500 self-end">{time}</span>
        </div>
      </div>
    </div>

  );
};

export default Message;