export const onReady = (code) => {
    document.addEventListener('DOMContentLoaded', function () {
        code();
    })
}
module.exports = {onReady: onReady};