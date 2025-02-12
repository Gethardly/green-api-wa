import { useEffect, useRef, useState } from 'react';
import axiosApi from '@/constants/axiosApi.ts';
import { useAppContext } from '@/contexts/AppContext.tsx';
import dayjs from 'dayjs';

const useGetMessages = (id?: string) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {
      idInstance,
      apiTokenInstance,
      messages,
      setGroupedChats,
      setMessages,
      setSortedMessages
    } = useAppContext();
    const [funcCallTime, setFuncCallTime] = useState<Date | null>(null);
    const isFetching = useRef(false);

    const sendMessage = async (chatId, message) => {
      setLoading(true);
      try {
        const sendMesRes = await axiosApi.post(`/waInstance${idInstance}/sendMessage/${apiTokenInstance}`, {
          chatId,
          message
        });

        if (sendMesRes && sendMesRes.status === 200) {
          const newMessage = {
            type: 'outgoing',
            idMessage: sendMesRes.data.idMessage,
            textMessage: message,
            timestamp: dayjs().unix(),
            chatId,
          }

          setSortedMessages((prevState) => [
            newMessage, ...prevState]);
          setGroupedChats((prevState) => ({...prevState, [chatId]: newMessage}));
          return sendMesRes.status;
        }
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false);
      }
    }

    const handleFunc = async (func) => {
      const now = new Date();
      setLoading(true);

      if (funcCallTime) {
        const diffSeconds = (now.getTime() - funcCallTime.getTime()) / 1000;
        if (diffSeconds < 5) {
          const delay = 5000 - diffSeconds * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      setFuncCallTime(now);
      await func();
    };

    const getChatHistory = async () => {
      setLoading(true);
      setMessages([]);
      try {
        const chatRes = await axiosApi.post(`/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`, {
          chatId: id,
          count: 30
        });
        if (chatRes && chatRes.status === 200) {
          setMessages(chatRes.data);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    useEffect(() => {
      setSortedMessages([...messages].sort((a, b) => b.timestamp - a.timestamp));
    }, [messages]);

    useEffect(() => {
      if (id) {
        handleFunc(getChatHistory);
      }
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

    return {loading, sendMessage}
  }
;

export default useGetMessages;