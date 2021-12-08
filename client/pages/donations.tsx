import MainShell from '@components/app-shells/MainShell';
import DonationsList from '@components/general/lists/DonationsList';

const Donations: NextPage = () => {
  return (
    <MainShell>
      <DonationsList />
    </MainShell>
  );
};

export default Donations;
