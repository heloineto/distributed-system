import MainShell from '@components/app-shells/MainShell';
import PendingList from '@components/general/admin/PendingList';

const Admin: NextPage = () => {
  return (
    <MainShell>
      <PendingList />
    </MainShell>
  );
};

export default Admin;
