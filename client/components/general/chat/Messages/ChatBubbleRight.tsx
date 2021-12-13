import { UserIcon } from '@heroicons/react/solid';

interface Props {
  children?: ReactNode;
  username: string;
}

const ChatBubbleRight = ({ children, username }: Props) => {
  return (
    <div className="flex ml-auto">
      <div className="bg-indigo-200 rounded-md rounded-tr-none p-2 max-w-xl">
        <h6 className="text-indigo-800 flex justify-start items-center text-sm font-medium">
          <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
          {username}
        </h6>
        <p className="text-indigo-900 ">{children}</p>
      </div>
      <div className="w-3 overflow-hidden inline-block">
        <div className="h-16 bg-indigo-200 rotate-45 transform origin-top-right"></div>
      </div>
    </div>
  );
};

export default ChatBubbleRight;
