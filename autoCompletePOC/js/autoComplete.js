var SDK = lpTag.agentSDK || {};
$(function() {
    SDK.init({
        notificationCallback: updateSuggestions
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

function writeCommand(text) {
    SDK.command('Write ChatLine',{text:text}, createCallback('Write'));
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

function updateSuggestions(data) {
    var suggestions = getSuggestionsFromInputValue(data && data.inputValue);
    if (suggestions) {
        var suggestionBox = $('.suggestionBox');
        suggestionBox.empty();
        for (var index = 0; index < suggestions.length; index++) {
            suggestionBox.append($('<button/>', {
                text: suggestions[index].text,
                click: writeCommand.bind(this, suggestions[index].value),
                class: 'suggestion',
                title: suggestions[index].text
            }));
            suggestionBox.append($('<br><br>'));
        }
    }
}

function getSuggestionsFromInputValue(inputValue) {
    // Call API here
    var suggestions = [];
    if (inputValue) {
        // text will be displayed in the button - contains the input text
        // value will actually be sent when clicked - does not contain the input value
        suggestions.push({text: inputValue + ' Suggestion 1', value: ' Suggestion 1'});
        suggestions.push({text: inputValue + ' Suggestion 2', value: ' Suggestion 2'});
        suggestions.push({text: inputValue + ' Suggestion 3', value: ' Suggestion 3'});
    }
    return suggestions;
}

function logger(type, text){
    if (typeof text === 'object') {
        text = JSON.stringify(text, null, 2);
    }
    var area = $(".logBox textarea");
    area.val(new Date().toTimeString() + ":  " + type + " - " + text + '\n' + area.val());
}
