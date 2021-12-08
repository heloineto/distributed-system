import MainShell from '@components/app-shells/MainShell';
import ReceptorList from '@components/general/lists/ReceptorList';

const Home: NextPage = () => {
  return (
    <MainShell>
      <ReceptorList />
    </MainShell>
  );
};

export default Home;
