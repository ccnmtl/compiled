/* eslint scanjs-rules/assign_to_src: "off" */

jQuery(document).ready(function() {
    if (jQuery('map[name="framework_map"]').length < 1) {
        return;
    }

    function padded(n) {
        return n < 10 ? '0' + n : '' + n;
    }

    var staticDir =
        'https://s3.amazonaws.com/ccnmtl-phtc-static-prod/media/img/' +
        'cdcframework/framework_';

    for (var i=1; i < 11; i++) {
        const id = padded(i);
        let img = new Image(378, 639);
        img.src = staticDir + id + '.jpg';

        jQuery('area.framework' + id).mouseover(function() {
            document.framework.src = img.src; return true;
        });
    }
});