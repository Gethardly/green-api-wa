import { useEffect, useState } from 'react';
import axiosApi from '@/constants/axiosApi.ts';
import { useInstance } from '@/contexts/InstanceContext.tsx';

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

const UseChatHistory = () => {
  const {idInstance, apiTokenInstance, clearInstance} = useInstance();
  const [incomingMessages, setIncomingMessages] = useState<IncomingMessage[]>([]);
  const [outGoingMessages, setOutGoingMessages] = useState<OutGoingMessage[]>([]);
  const sortedMessages = [...outGoingMessages, ...incomingMessages].sort((a, b) => a.timestamp - b.timestamp);
  const groupedMessages = sortedMessages.reduce((acc, msg) => {
    acc[msg.chatId] = msg;
    console.log(msg.chatId)
    return acc;
  }, {});
  const result = [];

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<MessagesError>(initialError);

  useEffect(() => {
    setLoading(true);
    setError(initialError)
    axiosApi.get(`/waInstance${idInstance}/lastIncomingMessages/${apiTokenInstance}?minutes=3240`)
      .then((response) => {
        setIncomingMessages(response.data);
      })
      .catch((error) => {
        setError((prevState) => ({...prevState, incoming: error}));
      });

    axiosApi.get(`/waInstance${idInstance}/lastOutgoingMessages/${apiTokenInstance}?minutes=3240`)
      .then((response) => {
        setOutGoingMessages(response.data);
      })
      .catch((error) => {
        setError((prevState) => ({...prevState, outgoing: error}));
      });
  }, []);

  return {groupedMessages, loading, error};
};

export default UseChatHistory;