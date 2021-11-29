import { Skeleton } from '@material-ui/lab';

const UpdateLoading = () => {
  const renderSkeleton = () => (
    <Skeleton className="w-full rounded-lg" animation="wave" variant="rect" height={56} />
  );

  return (
    <div className="p-5">
      <div className="text-4xl font-bold text-gray-800 text-center">
        Atualizar Cadastro
      </div>
      <div className="mt-4 flex flex-col space-y-4">
        {renderSkeleton()}
        <div className="flex gap-x-5">
          {renderSkeleton()}
          {renderSkeleton()}
        </div>
        {renderSkeleton()}
        {renderSkeleton()}
        <Skeleton
          className="w-full rounded-lg"
          animation="wave"
          variant="rect"
          height={40}
        />
      </div>
    </div>
  );
};

export default UpdateLoading;
