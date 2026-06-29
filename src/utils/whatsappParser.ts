import { WhatsAppMessage } from '../types';

export const parseWhatsAppChat = (text: string): WhatsAppMessage[] => {
  const lines = text.split('\n');
  const messages: WhatsAppMessage[] = [];
  
  let currentMsg: any = null;

  for (const line of lines) {
    if (line.trim() === '') continue;

    // Matches standard WhatsApp format with brackets: [28/6/26, 10:57:26 AM] Sender: Message
    let match = line.match(/^\[([^\]]+)\]\s*([^:]+):\s*(.*)$/);
    
    // Matches standard WhatsApp format without brackets: 28/6/26, 10:57 - Sender: Message
    if (!match) {
      match = line.match(/^(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}[, ]+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[a-zA-Z\.]{2,4})?)\s*(?:-)\s*([^:]+):\s*(.*)$/);
    }
    
    if (match) {
      if (currentMsg) {
        messages.push(currentMsg);
      }
      
      // Clean hidden characters (like LRM) and the ~ prefix WhatsApp adds to unknown contacts
      const cleanSender = match[2].replace(/[\u200E\u200F\u202A-\u202E]/g, '').replace(/^~\s*/, '').trim();
      const cleanText = match[3].replace(/[\u200E\u200F\u202A-\u202E]/g, '').trim();
      const rawTimestamp = match[1].trim();

      // Attempt to extract only the time from the timestamp for cleaner UI
      const timeMatch = rawTimestamp.match(/\d{1,2}:\d{2}(?::\d{2})?(?:\s*[a-zA-Z\.]{2,4})?/);
      const timeString = timeMatch ? timeMatch[0] : rawTimestamp;

      currentMsg = {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        senderName: cleanSender,
        text: cleanText,
        timestamp: timeString,
        isOfficial: cleanSender.toLowerCase().includes('admin') || cleanSender.toLowerCase().includes('voluntario'),
      };
    } else if (currentMsg) {
      // Continuation of previous message (multiline message)
      currentMsg.text += '\n' + line.replace(/[\u200E\u200F\u202A-\u202E]/g, '');
    }
  }
  
  if (currentMsg) {
    messages.push(currentMsg);
  }
  
  return messages;
};
