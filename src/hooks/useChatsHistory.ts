import { useCallback, useState } from 'react';
import axiosApi from '@/constants/axiosApi.ts';
import { useAppContext } from '@/contexts/AppContext.tsx';
import { IncomingMessage ,OutGoingMessage } from '@/types';

interface MessagesError {
  incoming: null | object;
  outgoing: null | object;
}

const initialError = {
  incoming: null,
  outgoing: null
}

const useChatsHistory = () => {
  const {idInstance, apiTokenInstance, setGroupedChats} = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MessagesError>(initialError);

  const getMessages = useCallback(async () => {
    setLoading(true);
    setError(initialError);

    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        axiosApi.get(`/waInstance${idInstance}/lastIncomingMessages/${apiTokenInstance}?minutes=20106`),
        axiosApi.get(`/waInstance${idInstance}/lastOutgoingMessages/${apiTokenInstance}?minutes=20106`)
      ]);

      const incomingMessages: IncomingMessage[] = incomingRes.data;
      const outGoingMessages: OutGoingMessage[] = outgoingRes.data;

      const sortedMessages = [...outGoingMessages, ...incomingMessages].sort((a, b) => b.timestamp - a.timestamp);

      const grouped = sortedMessages.reduce<Record<string, OutGoingMessage | IncomingMessage>>((acc, msg) => {
        if (!acc[msg.chatId] || acc[msg.chatId].timestamp < msg.timestamp) {
          acc[msg.chatId] = msg;
        }
        return acc;
      }, {});

      setGroupedChats(grouped);
    } finally {
      setLoading(false);
    }
  }, [idInstance, apiTokenInstance]);

  return {loading, error, getMessages};
};

export default useChatsHistory;