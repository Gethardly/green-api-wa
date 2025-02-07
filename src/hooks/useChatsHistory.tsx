import { useEffect, useState } from 'react';
import axiosApi from '@/constants/axiosApi.ts';
import { useAppContext } from '@/contexts/AppContext.tsx';

interface MessagesError {
  incoming: null | object;
  outgoing: null | object;
}

export interface OutGoingMessage {
  type: string;
  chatId: string;
  textMessage: string;
  timestamp: number;
  idMessage: string;
  typeMessage: string;
}

export interface IncomingMessage extends OutGoingMessage {
  senderId: string;
  senderName: string;
  statusMessage: string;
}

const initialError = {
  incoming: null,
  outgoing: null
}

const useChatsHistory = () => {
  const { idInstance, apiTokenInstance } = useAppContext();
  const [groupedMessages, setGroupedMessages] = useState<Record<string, OutGoingMessage | IncomingMessage>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<MessagesError>(initialError);

  const getMessages = () => {
    setLoading(true);
    setError(initialError);

    Promise.all([
      axiosApi.get(`/waInstance${idInstance}/lastIncomingMessages/${apiTokenInstance}?minutes=20106`).catch((err) => {
        setError((prev) => ({ ...prev, incoming: err }));
        return { data: [] };
      }),
      axiosApi.get(`/waInstance${idInstance}/lastOutgoingMessages/${apiTokenInstance}?minutes=20106`).catch((err) => {
        setError((prev) => ({ ...prev, outgoing: err }));
        return { data: [] };
      })
    ]).then(([incomingRes, outgoingRes]) => {
      const incomingMessages: IncomingMessage[] = incomingRes.data;
      const outGoingMessages: OutGoingMessage[] = outgoingRes.data;

      const sortedMessages = [...outGoingMessages, ...incomingMessages].sort((a, b) => b.timestamp - a.timestamp);

      const grouped = sortedMessages.reduce((acc, msg) => {
        if (!acc[msg.chatId] || acc[msg.chatId].timestamp < msg.timestamp) {
          acc[msg.chatId] = msg;
        }
        return acc;
      }, {} as Record<string, OutGoingMessage | IncomingMessage>);

      setGroupedMessages(grouped);
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    getMessages();
  }, []);

  return { groupedMessages, loading, error, getMessages };
};

export default useChatsHistory;