(function ($) {


    // Document ready
    $(function () {
        cuff();
    });


    // UI Controls

    // ImageList control
    cuff.controls.ImageList = function (el) {
        var control = {

            // Initialise the control
            init: function () {
                this.el = $(el);
                this.input = this.el.find('[data-role=filter]');
                this.images = this.el.find('[data-role=image]');
                this.bindEvents();
            },

            // Bind DOM events
            bindEvents: function () {
                var self = this;
                this.input.on('keyup', function () {
                    self.filter(self.input.val());
                });
            },

            // Filter images by a query string
            filter: function (query) {
                query = this.buildQueryRegExp(query);
                console.log('filter');
                this.images
                    .removeClass('hide')
                    .filter(function () {
                        return !query.test($(this).data('tags'));
                    })
                    .addClass('hide');
            },

            // Build a regular expression for a query
            buildQueryRegExp: function (query) {
                var pipedTags = query.trim().split(/\s+/).map(sanitizeTag).join('|');
                return new RegExp('\\b(' + pipedTags + ')[a-z0-9\-]*\\b', 'gi');
            }

        };
        control.init();
        return control;
    };


    // Utilities

    // Sanitize a tag
    function sanitizeTag (tag) {
        return tag.replace(/[^a-z0-9\-]+/, '').trim().toLowerCase();
    }

} (jQuery));