/**
 author:  JiangL
 date:    2019年04月21日
 */

$(function () {
    const container = $('#timeline-container');
    container.height(document.documentElement.clientHeight);

    window.onresize = function () {
        const height = document.documentElement.clientHeight;
        container.height(height);
    }
});

const loadTimeline = function () {

};