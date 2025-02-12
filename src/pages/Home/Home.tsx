import { useAppContext } from '@/contexts/AppContext.tsx';
import { Navigate, useParams } from 'react-router-dom';
import ChatsList from '@/components/chats/ChatsList.tsx';
import MessagesList from '@/components/messages/MessagesList.tsx';

const Home = () => {
  const {apiTokenInstance, idInstance,} = useAppContext();
  if (!apiTokenInstance || !idInstance) {
    return <Navigate to="/login"/>
  }
  const {id} = useParams();

  return (
    <div className="flex bg-info w-full h-screen overflow-x-hidden">
      <ChatsList id={id}/>
      {id && <MessagesList id={id}/>}
    </div>
  );
}

export default Home;