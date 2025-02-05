import { useInstance } from '@/components/context/InstanceContext.tsx';
import { Navigate } from 'react-router-dom';

const Home = (props) => {
  const {apiTokenInstance, idInstance} = useInstance();
  console.log(apiTokenInstance);

  if (!apiTokenInstance || !idInstance) {
    return <Navigate to="/login"/>
  }

  return (
    <div>Home page</div>
  );
}

export default Home;