interface User {
  username: string;
  password?: string;
  name?: string;
  state?: string;
  city?: string;
  usertype?: number;
  receptor?: number;
}

interface PendingUser {
  name: string;
  city: string;
  state: string;
  username: string;
}

interface Donation {
  donor: string;
  receptor: string;
  value: number;
  anonymous: boolean;
}

interface Message {
  from: string;
  message: string;
  direction?: 'left' | 'right';
}
