import {
  CheckCircleIcon,
  MailIcon,
  PhoneIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import { Button } from '@material-ui/core';

interface Props {}
const people = [
  {
    name: 'Jane Cooper',
    city: 'Ponta Grossa',
    state: 'PR',
    username: 'janecooper',
  },
  // More people...
];

const PendingList = (props: Props) => {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 m-5">
      {people.map(({ name, city, state, username }) => (
        <li
          key={username}
          className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
        >
          <div className="w-full flex items-center justify-between p-6 space-x-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="text-gray-900 text-sm font-medium truncate">{name}</h3>
                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-gray-800 text-xs font-medium bg-gray-200 rounded-full">
                  @{username}
                </span>
              </div>
              <p className="mt-1 text-gray-500 text-sm truncate">{`${city} - ${state}`}</p>
            </div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="w-0 flex-1 flex">
                <Button className="bg-green-100 text-green-600 rounded-none relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm font-medium border border-transparent rounded-bl-lg hover:text-green-500">
                  <CheckCircleIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-3">Aceitar</span>
                </Button>
              </div>
              <div className="-ml-px w-0 flex-1 flex">
                <Button className="bg-red-100 text-red-600 relative w-0 flex-1 rounded-none inline-flex items-center justify-center py-4 text-sm font-medium border border-transparent rounded-br-lg hover:text-red-500">
                  <XCircleIcon className="w-5 h-5" aria-hidden="true" />
                  <span className="ml-3">Rejeitar</span>
                </Button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PendingList;
