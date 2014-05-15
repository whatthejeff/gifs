(function () {


    // Document ready
    document.body.onload = function () {
        cuff();
    };


    // UI Controls

    // ImageList control
    cuff.controls.ImageList = function (el) {
        var control = {

            // Initialise the control
            init: function () {
                var self = this;
                this.el = el;
                this.filterInput = cuff.controls.ImageFilterInput(el.querySelector('[data-role=filter]'), this);
                this.images = toArray(el.querySelectorAll('[data-role=image]')).map(function (imageEl) {
                    return cuff.controls.Image(imageEl, self.previewPane);
                });
            },

            // Filter images by a query string
            filter: function (query) {
                query = this.buildQueryRegExp(query);
                this.images.forEach(function (image) {
                    return image.displayByRegExp(query);
                });
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

    // ImageFilterInput control (not used directly in DOM)
    cuff.controls.ImageFilterInput = function (el, list) {
        var control = {

            // Initialise the control
            init: function () {
                this.el = el;
                this.bindEvents();
            },

            // Bind DOM events
            bindEvents: function () {
                el.addEventListener('keyup', function () {
                    list.filter(el.value);
                });
            }

        };
        control.init();
        return control;
    };

    // Image control (not used directly in DOM)
    cuff.controls.Image = function (el, previewPane) {
        var control = {

            // Initialise the control
            init: function () {
                this.el = el;
                this.linkEl = el.querySelector('[data-role=url]');
                this.tags = toArray(el.querySelectorAll('[data-role=tag]')).map(function (tagEl) {
                    return sanitizeTag(tagEl.innerText);
                });
                this.tagString = this.tags.join(' ');
                this.bindEvents();
            },

            // Bind DOM events
            bindEvents: function () {
                var self = this;
                this.linkEl.addEventListener('mousedown', function () {
                    self.preview();
                    return false;
                });
            },

            // Get whether the image matches a RegExp query
            matchesRegExp: function (query) {
                return query.test(this.tagString);
            },

            // Display/hide the image based on whether it matches a RegExp query
            displayByRegExp: function (query) {
                if (this.matchesRegExp(query)) {
                    el.style.display = 'block';
                } else {
                    el.style.display = 'none';
                }
            },

            // Load a preview image
            preview: function () {
                if (!this.hasPreview) {
                    el.innerHTML += '' +
                        '<div class="preview">' +
                            '<img src="' + this.linkEl.href + '" alt="Image preview"/>' +
                        '</div>';
                    this.hasPreview = true;
                }
            }

        };
        control.init();
        return control;
    };


    // Utilities

    // Convert array-like object to array
    function toArray (obj, fn) {
        return Array.prototype.slice.call(obj);
    }

    // Sanitize a tag
    function sanitizeTag (tag) {
        return tag.replace(/[^a-z0-9\-]+/, '').trim().toLowerCase();
    }

} ());