import MainShell from '@components/app-shells/MainShell';
import ReceptorList from '@components/general/home/ReceptorList';

const Home: NextPage = () => {
  return (
    <MainShell>
      <ReceptorList />
    </MainShell>
  );
};

export default Home;
