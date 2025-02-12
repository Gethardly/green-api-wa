import { useState } from 'react';
import useGetMessages from '@/hooks/useGetMessages.ts';
import useChatsHistory from '@/hooks/useChatsHistory.ts';

interface FormData {
  phoneNumber: string;
  message: string;
}

const useNewChat = () => {
  const [formData, setFormData] = useState<FormData>({phoneNumber: '', message: ''});
  const [isOpen, setIsOpen] = useState(false);
  const {loading, getMessages} = useChatsHistory();
  const {sendMessage} = useGetMessages();

  const onSubmit = async (e, formData) => {
    try {
      e.preventDefault();
      const response = await sendMessage(formData.phoneNumber + '@c.us', formData.message);
      if (response === 200) {
        await getMessages();
      }
    } catch (e) {

    } finally {
      setIsOpen(false);
    }
  }
  const handleChange = (e) => {
    const {id, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }
  return {formData, handleChange, onSubmit, loading, isOpen, setIsOpen}
};

export default useNewChat;