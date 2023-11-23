const queryParams = new URLSearchParams(window.location.search);
const params = queryParams;
video = null; 

function bodyonload() {
    // run once
//    localStorage.clear();

    if (queryParams.get('enableOSD') == 'true'){
        invokeOSD();
    }

    setupVideo();

    // document.body.addEventListener('keypress', onKey);
    document.body.addEventListener('keydown', onKey);
    // document.body.onkeypress = function(e) {onKey(e)};
}

function setupVideo() {
    video = document.createElement('video');
    video.id = 'video';
    video.height = 720;
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.ontimeupdate = function() {updatePlayerCurrentTime()};
    // video.onpaused does not work. 
    // video.onpaused = function() {updatePlayerStatus()};
    video.onplay = function() {retrievePreviousPlayTime()};
    video.ondurationchange = function() {updatePlayerDuration()};

    source = document.createElement('source');
    source.src = params.get('src');
    source.type = 'video/mp4';

    video.appendChild(source);
    document.getElementById('videoDiv').append(video);
}

function retrievePreviousPlayTime() {
    video.muted = false;

    if (queryParams.get('saveCurrentTime') == 'false')
        return; 
    let timestamps = JSON.parse(localStorage.getItem('player_currentTime') || '{}');
    video.currentTime = parseFloat(timestamps[queryParams.get('src')] || 0);
    localStorage.setItem('player_currentTime', JSON.stringify(timestamps));
}

function updatePlayerCurrentTime() {
    let player_currentTime = document.getElementById('player_currentTime');
    if (player_currentTime) {
        player_currentTime.innerHTML = secondsToHHMMSS(video.currentTime);

        let player_status = document.getElementById('player_status');
        player_status.innerHTML = video.paused ? "pause" : "playing";
    }

    if (queryParams.get('saveCurrentTime') == 'false')
        return;
    let timestamps = JSON.parse(localStorage.getItem('player_currentTime') || '{}');
    timestamps[queryParams.get('src')] = video.currentTime;
    localStorage.setItem('player_currentTime', JSON.stringify(timestamps));
 
    // video.muted = false;
}

function updatePlayerDuration() {
    player_duration = document.getElementById('player_duration');
    if (player_duration)
        player_duration.innerHTML = ' / ' + secondsToHHMMSS(video.duration);
}

function secondsToHHMMSS(seconds){
    hours = Math.floor(seconds / 3600);
    minutes = Math.floor(seconds / 60) % 60;
    seconds = seconds % 60;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    return `${padStart(hours)}:${padStart(minutes)}:${padStart(seconds, 2)}s`;
}

function padStart(number, decimalPlace){
    decimalPlace = decimalPlace || 0;
    startPad = decimalPlace ? 5 : 2;
    return number.toFixed(decimalPlace).toString().padStart(startPad,'0');
}

function videoSeek(time){
    if (time != 0)
        time = video.currentTime + time;
    video.currentTime = time;
}

function handleVideoPlayEvent(keyCode){
    player_status = document.getElementById('player_status');

    switch (keyCode){
        case KEY_PLAY:
            video.play();
            if (player_status)
                player_status.innerHTML = video.paused ? "pause" : "playing";
            break;
        case KEY_PAUSE:
            video.pause();
            if (player_status)
                player_status.innerHTML = video.paused ? "pause" : "playing";
            break;
        case KEY_P:
        case KEY_PLAY_PAUSE:
            if (video.paused)
                handleVideoPlayEvent(KEY_PLAY);
            else
                handleVideoPlayEvent(KEY_PAUSE);
            break;
    }
}

function invokeOSD(){
    osd = document.getElementById('osd');
    if (osd) {
        osd.parentElement.removeChild(osd);
    }
    else {
        osd = document.createElement('p');
        osd.classList.add('player_osd');
        osd.id = 'osd';
        osd.innerHTML = params.get('src');
        document.body.append(osd);

        inElement = document.createElement('div');
        inElement.id = 'player_status';
        if (video) 
            inElement.innerHTML = video.paused ? "pause" : "playing";
        osd.append(inElement);

        inElement = document.createElement('div');
        osd_playerPosition = inElement;
        osd.append(inElement);

        inElement = document.createElement('span');
        inElement.id = 'player_currentTime';
        if (video) 
            inElement.innerHTML = secondsToHHMMSS(video.currentTime);
        osd_playerPosition.append(inElement);

        inElement = document.createElement('span');
        inElement.id = 'player_duration';
        if (video) 
            inElement.innerHTML = " / " + secondsToHHMMSS(video.duration);
        osd_playerPosition.append(inElement);
    }
}

function handleVideoSeekEvent(keyCode){
    switch (keyCode){
        case KEY_0:
            videoSeek(0);
            break;
        case KEY_LEFT:
            videoSeek(-10);
            break;
        case KEY_RIGHT:
            videoSeek(10);
            break;
        case KEY_FF:
            videoSeek(60);
            break;
        case KEY_RW:
            videoSeek(-60);
            break;
        case KEY_CHUP:
            videoSeek(600);
            break;
        case KEY_CHDOWN:
            videoSeek(-600);
            break;
    }
}

function history_previous(event){
    switch(event){
        case KEY_ESCAPE:
            window.history.back();
            break;

        case KEY_B:
        case KEY_BACK:
            if (params.get('returnUrl'))
                location.href = util.base64urlDecode(params.get('returnUrl'));
            else
                window.history.back();
            break;
    }
}

function onKey(event) {
    // if (get_query_parameter('keylogger'))
    console.log('Key Event: ', event);
    switch (event.keyCode || event) {
        case KEY_P:
        case KEY_PLAY_PAUSE:
        case KEY_PLAY:
        case KEY_PAUSE:
            handleVideoPlayEvent(event.keyCode);
            break;

        case KEY_0:
        case KEY_LEFT:
        case KEY_RIGHT:
        case KEY_FF:
        case KEY_RW:
        case KEY_CHUP:
        case KEY_CHDOWN:
            handleVideoSeekEvent(event.keyCode);
            break;

        case KEY_INFO:
        case KEY_OK:
        case KEY_O:
        case KEY_I:
            invokeOSD();
            break;

        case KEY_B:
        case KEY_BACK:
        case KEY_ESCAPE:
            history_previous();
            break;

        default:
            break;
    }
}
