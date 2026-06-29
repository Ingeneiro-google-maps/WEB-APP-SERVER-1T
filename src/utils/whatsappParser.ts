import { WhatsAppMessage } from '../types';

export const parseWhatsAppChat = (text: string): WhatsAppMessage[] => {
  const lines = text.split('\n');
  const messages: WhatsAppMessage[] = [];
  
  // Matches typical WhatsApp exported chat lines
  // e.g. "12/09/2023, 10:45 - Sender Name: Message content"
  // e.g. "[12/09/2023, 10:45:00] Sender Name: Message content"
  const regex = /^(?:\[)?\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}[, ]+\d{1,2}:\d{2}(?::\d{2})?(?: [a-zA-Z\.]+)?(?:\])?\s*(?:-)?\s*([^:]+):\s*(.*)$/;
  
  let currentMsg: any = null;

  for (const line of lines) {
    if (line.trim() === '') continue;

    const match = line.match(regex);
    if (match) {
      // If it's a system message like "Messages and calls are end-to-end encrypted", it might get caught if it has a colon, but usually it doesn't.
      if (currentMsg) {
        messages.push(currentMsg);
      }
      currentMsg = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        senderName: match[1].trim(),
        text: match[2].trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOfficial: false,
      };
    } else if (currentMsg) {
      // Continuation of previous message
      currentMsg.text += '\n' + line;
    }
  }
  
  if (currentMsg) {
    messages.push(currentMsg);
  }
  
  return messages;
};
