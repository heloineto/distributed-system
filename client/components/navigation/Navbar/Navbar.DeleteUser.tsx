import { ExclamationIcon } from '@heroicons/react/outline';
import { Button, Dialog, DialogProps, useMediaQuery, useTheme } from '@material-ui/core';

interface Props {
  onRemove: () => void;
}

const NavbarDeleteUser = ({ onClose, onRemove, ...rest }: DialogProps & Props) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={mobile}
      maxWidth={'sm'}
      fullWidth={true}
      onClose={onClose}
      {...rest}
    >
      <div className="p-5">
        <div>
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center">
            <div className="text-lg leading-6 font-medium text-gray-900">
              Deletar Conta
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {`Tem certeza de que deseja deletar sua conta? (Essa ação não pode ser desfeita)`}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <Button
            className="w-full rounded-md py-2 shadow-none bg-red-600 text-base text-white hover:bg-red-700"
            onClick={onRemove}
            variant="contained"
          >
            Remover
          </Button>
          <Button
            className="mt-3 w-full border-gray-400 rounded-md py-2 text-base text-gray-800 hover:text-gray-600"
            onClick={onClose as any}
            variant="outlined"
            color="inherit"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default NavbarDeleteUser;
