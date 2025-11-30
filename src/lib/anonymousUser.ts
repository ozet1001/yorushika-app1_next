import { v4 as uuidv4 } from 'uuid';

export function getAnonymousUserId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let userId = localStorage.getItem('anonymousUserId');

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('anonymousUserId', userId);
  }

  return userId;
}