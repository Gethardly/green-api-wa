import { useEffect, useRef, useState } from 'react';
import axiosApi from '@/constants/axiosApi.ts';
import { useAppContext } from '@/contexts/AppContext.tsx';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const useGetMessages = () => {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {idInstance, apiTokenInstance} = useAppContext();
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState(messages);
  const isFetching = useRef(false);

  const sendMessage = (chatId, message) => {
    axiosApi.post(`/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {chatId, message})
      .then((response) => {
        if (response.status === 200) {
          setSortedMessages((prevState) => [
            {
              type: 'outgoing',
              idMessage: response.data.idMessage,
              textMessage: message,
              timestamp: dayjs().unix(),
              chatId,
            }, ...prevState]);
        }
      })
  }

  useEffect(() => {
    setSortedMessages(messages.sort((a, b) => b.timestamp - a.timestamp));
  }, [messages]);

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

  const restAPI = {
    receiveNotification: async () => {
      try {
        const response = await axiosApi.get(`/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`);
        return response.data;
      } catch (error) {
        console.error('Error receiving notification:', error);
        throw error;
      }
    },
    deleteNotification: async (receiptId: string) => {
      try {
        await axiosApi.delete(`/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`);
      } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
      }
    }
  };

  const fetchMessages = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await restAPI.receiveNotification();
      const webhookBody = response.body;
      if (webhookBody && webhookBody.typeWebhook === 'incomingMessageReceived' && id === webhookBody.senderData.chatId) {
        const {timestamp, idMessage, senderData, messageData} = webhookBody;
        const {chatId} = senderData || {};
        const {typeMessage, textMessageData} = messageData || {};
        const {textMessage} = textMessageData || {};

        const newMessage = {
          type: 'incoming',
          timestamp,
          idMessage,
          chatId,
          typeMessage,
          textMessage,
        };
       /* setGroupedMessages((prev) => (
          {...prev, [chatId]: newMessage})
        );*/

        setSortedMessages((prevMessages) => [newMessage, ...prevMessages]);
        await restAPI.deleteNotification(response.receiptId);
      } else if (webhookBody && webhookBody.typeWebhook) {
        await restAPI.deleteNotification(response.receiptId);
      }
    } catch (error) {
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return {sortedMessages, loading, sendMessage}
};

export default useGetMessages;