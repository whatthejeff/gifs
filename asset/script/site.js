(function ($, win) {


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
                this.setInitialState();
            },

            // Bind DOM events
            bindEvents: function () {
                var self = this;
                var pushStateTimer;
                this.input.on('keyup', function () {
                    var query = self.input.val();
                    self.filter(query);
                    if (win.history && win.history.pushState) {
                        if (pushStateTimer) {
                            clearTimeout(pushStateTimer);
                        }
                        pushStateTimer = setTimeout(function () {
                            win.history.pushState({query: query}, '', '?q=' + query);
                        }, 600);
                    }
                });
                $(win).on('popstate', function (evt) {
                    var state = evt.originalEvent.state;
                    var query = (state ? state.query : '');
                    self.input.val(query);
                    self.filter(query);
                });
            },

            // Set the initial filter state
            setInitialState: function () {
                var query = parseQueryString(win.location.search).q;
                if (query) {
                    this.input.val(query);
                    this.filter(query);
                }
            },

            // Filter images by a query string
            filter: function (query) {
                query = this.buildQueryRegExp(query);
                this.images
                    .removeClass('hide')
                    .filter(function () {
                        return !query.test(sanitizeTags($(this).data('tags')));
                    })
                    .addClass('hide');
            },

            // Build a regular expression for a query
            buildQueryRegExp: function (query) {
                var pipedTags = query.toLowerCase().trim().split(/\s+/).map(sanitizeTag).join('|');
                return new RegExp('\\b(' + pipedTags + ')[a-z0-9\-]*\\b', 'i');
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

    // Sanitize multiple tags (separated by spaces)
    function sanitizeTags (tags) {
        return tags.split(/\s+/).map(sanitizeTag).join(' ');
    }

    // Simple query parser
    function parseQueryString (qs) {
        var params = {};
        qs.replace(/^\?/, '').split('&').forEach(function (param) {
            var parts = param.split('=');
            var key = parts.shift();
            var val = parts.join('=');
            params[key] = val;
        });
        return params;
    }

} (jQuery, window));