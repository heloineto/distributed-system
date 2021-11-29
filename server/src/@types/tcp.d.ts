interface TCPRequest {
  protocol: number;
  message: TCPMessage;
  required: string[];
}

interface TCPMessage {
  [key: string]: any;
}
