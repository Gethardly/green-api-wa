import { useEffect, useState } from 'react';
import axiosApi from '@/constants/axiosApi.ts';
import { useAppContext } from '@/contexts/AppContext.tsx';
import { useParams } from 'react-router-dom';

const UseGetMessages = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {idInstance, apiTokenInstance} = useAppContext();
  const [messages, setMessages] = useState([]);
  const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    axiosApi.post(`/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`, {
      chatId: id,
      count: 30
    }).then((response) => {
      setMessages(response.data);
    }).catch((e) => {
      setError(e);
    }).finally(() => {
      setLoading(false);
    })
  }, [id]);

  return {sortedMessages, loading}
};

export default UseGetMessages;