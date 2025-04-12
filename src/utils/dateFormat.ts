export function formatMessageTime(timestamp: string): string {
  const messageDate = new Date(timestamp);
  const now = new Date();
  
  // Check if the message is from today
  const isToday = messageDate.toDateString() === now.toDateString();
  
  // Format time (e.g., "2:45 PM")
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  const timeString = messageDate.toLocaleTimeString('en-US', timeOptions);
  
  // If message is from today, just show time
  if (isToday) {
    return timeString;
  }
  
  // If not today, show "month/day time"
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric'
  };
  const formattedDate = messageDate.toLocaleDateString('en-US', dateOptions);
  return `${formattedDate} ${timeString}`;
} 