import MainShell from '@components/app-shells/MainShell';
import PendingList from '@components/general/admin/PendingList';

const Admin: NextPage = () => {
  return (
    <MainShell>
      <div className="text-4xl font-bold text-gray-800 text-center mt-5">
        Receptores Pendentes
      </div>
      <PendingList />
    </MainShell>
  );
};

export default Admin;
