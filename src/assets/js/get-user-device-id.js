function getUDId() { return function (e) { for (var n = 5381, t = e.length; t--;)n = 33 * n ^ e.charCodeAt(t); return n >>> 0 }([navigator.userAgent, [screen.height, screen.width, screen.colorDepth].join("x"), (new Date).getTimezoneOffset(), !!window.sessionStorage, !!window.localStorage].join("###")) }