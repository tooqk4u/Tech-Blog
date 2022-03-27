const warningTimeout = 1800000;
const timeoutNow = 60000;
let warningTimerID; 
let timeoutTimerID;

function startTimer() {
    // window.setTimeout returns an Id that can be used to start and stop a timer
    warningTimerID = window.setTimeout(warningInactive, warningTimeout);
}

function warningInactive() {
    window.clearTimeout(warningTimerID);
    timeoutTimerID = window.setTimeout(IdleTimeout, timeoutNow);
    let stayLoggedIn = alert("You have been inactive for 30 minutes. If you click ok within 60 seconds, you will stay logged in. Otherwise, you will need to log in again.");
    if (stayLoggedIn) {
        resetTimer();
    }

}

function resetTimer() {
    window.clearTimeout(timeoutTimerID);
    window.clearTimeout(warningTimerID);
    startTimer();
}

// Logout the user.
function IdleTimeout() {
    document.getElementById('logout').click();
}


startTimer();

document.onmousemove = function () {
    resetTimer();
};

document.onkeypress = function () {
  resetTimer();
}
