
export const utilService = {
    delay,
    getRndIntInc,
    makeId,
    getRandomColor,
    applyDrag,
    saveToStorage,
    loadFromStorage,
    lightenDarkenColor,
    debounce
}

function delay(ms = 1500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

function getRndIntInc(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function applyDrag(arr, dragResult) {
    console.log('arr>>', arr, 'drag', dragResult);
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;
    const result = [...arr];
    let itemToAdd = payload;
    if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
        // console.log(itemToAdd);
    }
    if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
    }
    console.log(result);
    return result;
}

function makeId(length = 8) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value) || null);
}

function loadFromStorage(key) {
    let data = localStorage.getItem(key);
    return (data) ? JSON.parse(data) : undefined;
}

function lightenDarkenColor(colorCode, amount) {
    if (colorCode === '#0079bf') return '#055a8c'
    if (colorCode === '#00c2e0') return '#0098b7'
    var usePound = false;

    if (colorCode[0] == "#") {
        colorCode = colorCode.slice(1);
        usePound = true;
    }

    var num = parseInt(colorCode, 16);

    var r = (num >> 16) + amount;

    if (r > 255) {
        r = 255;
    } else if (r < 0) {
        r = 0;
    }

    var b = ((num >> 8) & 0x00FF) + amount;

    if (b > 255) {
        b = 255;
    } else if (b < 0) {
        b = 0;
    }

    var g = (num & 0x0000FF) + amount;

    if (g > 255) {
        g = 255;
    } else if (g < 0) {
        g = 0;
    }

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function debounce(callback, wait) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback(...args);
        }, wait);
    };
}