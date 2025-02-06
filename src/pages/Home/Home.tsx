import { useAppContext } from '@/contexts/AppContext.tsx';
import { Navigate, useParams } from 'react-router-dom';
import Chats from '@/components/chats/Chats.tsx';
import MessagesList from '@/components/messages/MessagesList.tsx';

const Home = () => {
  const {apiTokenInstance, idInstance} = useAppContext();
  const {id} = useParams();

  if (!apiTokenInstance || !idInstance) {
    return <Navigate to="/login"/>
  }

  return (
    <div className="flex bg-info w-full h-screen overflow-x-hidden">
      <Chats id={id}/>
      {id && <MessagesList id={id.replace(/\D/g, "")}/>}
    </div>
  );
}

export default Home;