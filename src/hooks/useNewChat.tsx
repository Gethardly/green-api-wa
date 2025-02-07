import { useState } from 'react';

interface FormData {
  phoneNumber: string;
  message: string;
}

const useNewChat = () => {
  const [formData, setFormData] = useState<FormData>({phoneNumber: '', message: ''});
  const handleChange = (e) => {
    const {id, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }
  return {formData, handleChange}
};

export default useNewChat;