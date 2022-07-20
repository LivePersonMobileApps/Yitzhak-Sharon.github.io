var SDK = lpTag.agentSDK || {};
$(function() {
    SDK.init({
        notificationCallback: getLogFunction('INFO', 'Notification received!'),
        visitorFocusedCallback: getLogFunction('INFO', 'Visitor Focused received!'),
        visitorBlurredCallback: getLogFunction('INFO', 'Visitor Blurred received!')
    });
});

function getLogFunction(type, message){
    return function(data) {
        if (typeof data === 'object') {
            data = JSON.stringify(data, null, 2);
        }
        logger(type, message + ' The ' + type + ' data: ' + data);
    }
}

function writeCommand() {
    var commandVal = $(".commandInput").val();
    SDK.command('Write ChatLine',{text:commandVal}, createCallback('Write'));
}
function get() {
    var getKey = $(".getInput").val();
    SDK.get(getKey, getSuccess, getLogFunction('ERROR', 'Error in get!'));
}
function bind() {
    var bindKey = $(".bindInput").val();
    SDK.bind(bindKey, bindSuccess, createCallback('Bind'));
}
function unbind() {
    //clearLogger();
    var bindKey = $(".bindInput").val();
    SDK.unbind(bindKey, bindSuccess, createCallback('Unbind'));
}

function setRadioButton(index) {
    $('input:radio[name=file]')[index].checked = true;
}

function _urlToFile(url, callback) {
    // Attempting to load a file from a URL
    if (!url || !callback) {
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
        if (this.status === 200) {
            var file = this.response;
            var name = url.split('\\').pop().split('/').pop();
            callback({file: file, name: name});
        } else {
            logger('ERROR', 'Could not load image. Received response: ' + this.status);
            logger('INFO', 'Trying to send a file that does not exist anyway - for testing purposes');
            var file = url === 'bla' ? url : this.response;
            var name = url.split('\\').pop().split('/').pop();
            callback({file: file, name: name});
        }
    };
    try {
        xhr.send();
    } catch (e) {
        logger('ERROR', 'Failed to load file: ' + url);
    }
}

function sendFile() {
    var url = $('input:radio[name=file]:checked').val();
    _urlToFile(url, _sendFile)
}

function _sendFile(fileData) {
    SDK.command('Send File', fileData, createCallback('Send File'));
}


function createCallback(name) {
    return function(error) {
        if (error) {
            getLogFunction('ERROR', 'Error in ' + name + '!')(error);
        } else {
            getLogFunction('INFO', name + ' success!')();
        }
    }
}

function getSuccess(data){
    $(".getResults").html(JSON.stringify(data));
    getLogFunction('INFO', 'Get success!')(data);
}
function bindSuccess(data){
    $(".bindResults").html(JSON.stringify(data));
    getLogFunction('INFO', 'Bind success!')(data);
}

function logger(type, text){
    if (typeof text === 'object') {
        text = JSON.stringify(text, null, 2);
    }
    var area = $(".logBox textarea");
    area.val(new Date().toTimeString() + ":  " + type + " - " + text + '\n' + area.val());
}
