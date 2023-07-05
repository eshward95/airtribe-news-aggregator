const { getNewsHelper } = require("./getNewshelper");
let intervalId;
function startInterval(user) {
  console.log("signup");
  if (intervalId) {
    console.log("please");
    stopInterval();
  }
  // Check if user is logged in
  if (user) {
    //Call the cron 20 minutes once
    const duration = 1000 * 20 * 60;

    // Define the task to be executed by the interval
    const task = async () => {
      const preference = user.hasOwnProperty("preference")
        ? user.preference
        : "general";
      try {
        getNewsHelper(preference);
      } catch (error) {
        console.error(error);
      }
    };

    // Start the interval
    intervalId = setInterval(task, duration);
  }
}
function stopInterval() {
  // Stop the interval if it's running
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

module.exports = { startInterval, stopInterval };
