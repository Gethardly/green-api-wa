import { useEffect, useState } from 'react';
import axiosApi from '@/constants/axiosApi.ts';
import { useAppContext } from '@/contexts/AppContext.tsx';
import { useParams } from 'react-router-dom';

const UseGetMessages = () => {
  const {id} = useParams();
  const {idInstance, apiTokenInstance} = useAppContext();
  const [messages, setMessages] = useState([]);
  const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);

  useEffect(() => {
    setMessages([]);
    axiosApi.post(`/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`, {
      chatId: id,
      count: 30
    }).then((response) => {
      setMessages(response.data);
    })
  }, [id]);

  return {sortedMessages}
};

export default UseGetMessages;