function isMobileDevice(): boolean {
    const userAgent = navigator.userAgent;
    const mobileKeywords = ['Android', 'iPhone', 'iPad', 'Windows Phone', 'Mobile'];
    
    for (const keyword of mobileKeywords) {
        if (userAgent.indexOf(keyword) !== -1) {
            return true;
        }
    }
    
    return false;
}

function isIOS() : boolean {
    const userAgent = navigator.userAgent;
    const mobileKeywords = ['iPhone', 'iPad'];
    
    for (const keyword of mobileKeywords) {
        if (userAgent.indexOf(keyword) !== -1) {
            return true;
        }
    }
    
    return false;
}

export {
    isMobileDevice,
    isIOS,
}