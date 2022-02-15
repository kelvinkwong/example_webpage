function display_useragent(){
    document.getElementById('useragent').innerHTML = navigator.userAgent;
}

function display_this_url(){
    document.getElementById('origin').innerHTML = window.location.origin;
    document.getElementById('pathname').innerHTML = window.location.pathname;
    document.getElementById('parameters').innerHTML = window.location.search;
}

function bodyonload(){
    console.log("body loaded");
    display_useragent();
    display_this_url();
}