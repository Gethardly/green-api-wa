import { useInstance } from '@/contexts/InstanceContext.tsx';
import { Navigate } from 'react-router-dom';
import useChatHistory from '@/hooks/useChatHistory.tsx';
import Chats from '@/components/chats/Chats.tsx';

const Home = () => {
  const {apiTokenInstance, idInstance} = useInstance();

  if (!apiTokenInstance || !idInstance) {
    return <Navigate to="/login"/>
  }

  return (
    <div className="flex bg-info w-full h-screen">
      <div className="w-[5%]">123</div>
      <Chats/>
      <div className="w-full"></div>
    </div>
  );
}

export default Home;