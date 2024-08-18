export function formatElapsedTime(firebaseTimestamp) {
    // Convert Firebase timestamp to milliseconds
    const firebaseTimeInMillis = firebaseTimestamp.seconds * 1000; // Firebase timestamps are in seconds
    const currentTimeInMillis = Date.now();

    // Calculate the difference in milliseconds
    const elapsedTimeInMillis = currentTimeInMillis - firebaseTimeInMillis;

    // Convert milliseconds to seconds
    const elapsedTimeInSeconds = Math.floor(elapsedTimeInMillis / 1000);

    // Format the time based on the elapsed time in seconds
    let formattedTime = "";

    if (elapsedTimeInSeconds < 60) {
      // Time is less than 60 seconds
      formattedTime = `${elapsedTimeInSeconds} seconds ago`;
    } else if (elapsedTimeInSeconds < 3600) {
      // Time is 60 seconds or more but less than 3600 seconds (1 hour)
      const elapsedMinutes = Math.floor(elapsedTimeInSeconds / 60);
      formattedTime = `${elapsedMinutes} minutes ago`;
    } else if (elapsedTimeInSeconds < 86400) {
      // Time is 3600 seconds or more but less than 86400 seconds (1 day)
      const elapsedHours = Math.floor(elapsedTimeInSeconds / 3600);
      formattedTime = `${elapsedHours} hours ago`;
    } else {
      // Time is 86400 seconds or more (1 day or more)
      const elapsedDays = Math.floor(elapsedTimeInSeconds / 86400);
      formattedTime = `${elapsedDays} days ago`;
    }

    return formattedTime;
}