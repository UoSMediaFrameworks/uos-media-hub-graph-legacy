/**
 * Created by aaronphillips on 13/06/2016.
 */
"use strict";

//TODO load source code for test from actual file used (dependency management issue) - APhillips 13-Jun
var getPasswordFromCookie = function(cookieVal) {
    if(cookieVal && cookieVal.indexOf("=") !== -1) {
        cookieVal = cookieVal.replace('=', '');
    }

    return cookieVal;
};


describe('Test-Cookie-parsing', function () {
    
    it("getPasswordFromCookie handles empty cookie values", function() {
        var cookieValWithTrailingEquals = "";
        var expectedCookieVal = "";

        var actualCookieVal = getPasswordFromCookie(cookieValWithTrailingEquals);

        if(actualCookieVal.indexOf('=') !== -1)
            throw new Error("Cookie still has equals character - [ actual: " + actualCookieVal + ", expected: " + expectedCookieVal + "]");

        if(actualCookieVal !== expectedCookieVal)
            throw new Error("Cookie Value incorrected - [ actual: " + actualCookieVal + ", expected: " + expectedCookieVal + "]");
    });
    
    it('getPasswordFromCookie should return the same cookie value with trailing = removed', function () {
        var cookieValWithTrailingEquals = "cookie-val=";
        var expectedCookieVal = "cookie-val";

        var actualCookieVal = getPasswordFromCookie(cookieValWithTrailingEquals);

        if(actualCookieVal.indexOf('=') !== -1)
            throw new Error("Cookie still has equals character - [ actual: " + actualCookieVal + ", expected: " + expectedCookieVal + "]");
        
        if(actualCookieVal !== expectedCookieVal)
            throw new Error("Cookie Value incorrected - [ actual: " + actualCookieVal + ", expected: " + expectedCookieVal + "]");
    });
    
    it("getPasswordFromCookie should return the same cookie value if cookie has no =", function() {
        var cookieValWithTrailingEquals = "cookie-val";
        var expectedCookieVal = "cookie-val";

        var actualCookieVal = getPasswordFromCookie(cookieValWithTrailingEquals);

        if(actualCookieVal.indexOf('=') !== -1)
            throw new Error("Cookie still has equals character - [ actual: " + actualCookieVal + ", expected: " + expectedCookieVal + "]");

        if(actualCookieVal !== expectedCookieVal)
            throw new Error("Cookie Value incorrected - [ actual: " + actualCookieVal + ", expected: " + expectedCookieVal + "]");
    });
});