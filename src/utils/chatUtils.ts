/**
 * Generates a consistent chat room ID between two users
 * 
 * @param userId1 The ID of the first user
 * @param userId2 The ID of the second user
 * @returns A chat room ID that will be the same regardless of the order of user IDs
 */
export function generateChatRoomId(userId1: string, userId2: string): string {
  // Sort the user IDs to ensure consistent room ID regardless of who initiates the chat
  const sortedUserIds = [userId1, userId2].sort();
  return `chat_${sortedUserIds[0]}_${sortedUserIds[1]}`;
}

/**
 * Extracts user IDs from a chat room ID
 * 
 * @param roomId The chat room ID
 * @returns An array of the two user IDs contained in the room ID
 */
export function extractUserIdsFromRoomId(roomId: string): string[] | null {
  // Check if it's a valid room ID format
  const match = roomId.match(/^chat_(.+)_(.+)$/);
  if (!match) return null;
  
  return [match[1], match[2]];
}

/**
 * Gets the other participant's ID from a room ID and the current user's ID
 * 
 * @param roomId The chat room ID
 * @param currentUserId The current user's ID
 * @returns The other participant's ID or null if not found
 */
export function getOtherParticipantId(roomId: string, currentUserId: string): string | null {
  const userIds = extractUserIdsFromRoomId(roomId);
  if (!userIds) return null;
  
  return userIds[0] === currentUserId ? userIds[1] : userIds[0];
} 