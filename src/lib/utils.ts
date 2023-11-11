import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string | Date | undefined) => {
  const currentDate = new Date();
  const parsedDate = new Date(dateString || '');

  /** get time difference */
  const timeDiff = currentDate.getTime() - parsedDate.getTime();

  /** convert time difference to seconds */
  const secondsDiff = timeDiff / 1000;

  /** get appropriate time difference depending on seconds */
  if (secondsDiff < 60) {
    // Less than a minute
    return `${Math.round(secondsDiff)} seconds ago`;
  } else if (secondsDiff < 3600) {
    // Less than an hour
    const minutes = Math.floor(secondsDiff / 60);
    return `${minutes} minutes ago`;
  } else if (secondsDiff < 86400) {
    // Less than a day
    const hours = Math.floor(secondsDiff / 3600);
    return `${hours} hours ago`;
  } else {
    // More than a day
    const days = Math.floor(secondsDiff / 86400);
    return `${days} days ago`;
  }
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};