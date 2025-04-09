function dateTimeFormat () {
    const now = new Date();
    return now.getSeconds() + '-' + now.getMinutes() + '-' + now.getHours() +
        '  ' + now.getDate() + '-' + now.getMonth() + '-' + now.getFullYear();
}

module.exports = dateTimeFormat();