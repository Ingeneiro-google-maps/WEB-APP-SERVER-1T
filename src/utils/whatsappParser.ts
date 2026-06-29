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
      let cleanSender = match[2].replace(/[\u200E\u200F\u202A-\u202E\u202C]/g, '').replace(/^~\s*/, '').trim();
      const cleanText = match[3].replace(/[\u200E\u200F\u202A-\u202E\u202C]/g, '').trim();
      
      // If the sender is a phone number, replace it with a generic name
      if (/^\+?[\d\s\-]+$/.test(cleanSender)) {
        cleanSender = 'Voluntario';
      }

      // Filter out common WhatsApp system messages
      const isSystemMessage = 
        cleanText.includes('usou uma ligação do grupo para se juntar') ||
        cleanText.includes('aderiu a partir da comunidade') ||
        cleanText.includes('saiu do grupo') ||
        cleanText.includes('adicionou') ||
        cleanText.includes('ficheiro de áudio não revelado') ||
        cleanText.includes('vídeo não revelado') ||
        cleanText.includes('afixou uma mensagem') ||
        cleanText.includes('alterou as definições deste grupo') ||
        cleanText.includes('Criou o grupo') ||
        cleanText.includes('Foi adicionado/a a este grupo') ||
        cleanText.includes('As mensagens e chamadas são encriptadas') ||
        cleanText.includes('Esta mensagem foi eliminada.') ||
        cleanText.includes('Esta mensagem foi editada');

      if (!isSystemMessage && cleanText.length > 0) {
        currentMsg = {
          id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          senderName: cleanSender,
          text: cleanText,
          timestamp: '', // Removing time/date as requested
          isOfficial: cleanSender.toLowerCase().includes('admin') || cleanSender.toLowerCase().includes('voluntario'),
        };
      } else {
        currentMsg = null;
      }
    } else if (currentMsg) {
      // Continuation of previous message (multiline message)
      currentMsg.text += '\n' + line.replace(/[\u200E\u200F\u202A-\u202E\u202C]/g, '');
    }
  }
  
  if (currentMsg) {
    messages.push(currentMsg);
  }
  
  return messages;
};
