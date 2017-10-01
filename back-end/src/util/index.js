
export function validUsername(nickname) {
    var regex = /^\w*$/;
    return regex.exec(nickname) !== null;
}

export function findIndex(arr, id) {
    var len = arr.length;

    while (len--) {
        if (arr[len].id === id) {
            return len;
        }
    }

    return -1;
}
