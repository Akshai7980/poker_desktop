'use strict';
var clockTimeout;
var trustedOrigin = "https://fullhouse.adda52poker.com";
function tickerTimer() {
    var before;

    if (clockTimeout) {
        clearTimeout(clockTimeout);
    }

    before = new Date().getTime();
    function updateClockTime(before) {
        var now = new Date().getTime();
        self.postMessage({
            timeDiff: now - before
        });
        (function (now1) {
            if (clockTimeout) {
                clearTimeout(clockTimeout);
            }
            clockTimeout = setTimeout(function () {
                clearTimeout(clockTimeout);
                clockTimeout = null;
                updateClockTime(now1);
            }, 200);
        })(now);
    }
    updateClockTime(before);
}

self.addEventListener("message", function (evt) {
    if (!!evt.origin && evt.origin == trustedOrigin ) {
        let data = evt.data;
        switch (data.command) {
            case "startTickerTimer":
                tickerTimer();
                break;
            default:
            //do nothing
        }
    }
}, false);