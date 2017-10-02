import $ from 'jquery';

export default (options) => {
    return $.ajax({
        url: options.url,
        method: options.method || 'GET',
        data: JSON.stringify(options.data) || null,
        contentType: options.contentType || 'application/json',

    }).then(function (json) {
        return json;
    });
}

