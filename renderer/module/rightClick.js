/**
 author:  JiangL
 date:    2019年05月07日
 */

$(function () {
    setTimeout(function () {
        $.contextMenu({
            selector: ".remind",
            items: {
                "edit": {
                    name: "修改", icon: "edit", callback: function (key, opt) {
                        const id = $(this).find('p.remind-id').text();
                    }
                },
                "delete": {
                    name: "删除", icon: "delete", callback: function (key, opt) {
                        const id = $(this).find('p.remind-id').text();
                    }
                }
            }
        });
    });
});