import { LibraryIcon } from '@heroicons/react/solid';

interface Props {
  children?: ReactNode;
  username: string;
}
const ChatBubbleLeft = ({ children, username }: Props) => {
  return (
    <div className="flex">
      <div className="w-3 overflow-hidden inline-block">
        <div className="h-16 bg-blue-200 -rotate-45 transform origin-top-left"></div>
      </div>
      <div className="bg-blue-200 rounded-md rounded-tl-none p-2 max-w-xl">
        <h6 className="text-blue-800 flex justify-start items-center text-sm font-medium">
          <LibraryIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
          {username}
        </h6>
        <p className="text-blue-900">{children}</p>
      </div>
    </div>
  );
};

export default ChatBubbleLeft;
