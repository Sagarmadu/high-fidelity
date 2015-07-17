import Ember from 'ember';

export default Ember.Controller.extend({
    isAdding: false,
    isInErrorState: false,

    rssURL: '',

    _createFromController: function(controller, rssURL) {
        console.debug('Find podcast with rssURL:', rssURL);
        var existingPodcast = controller.store.find('podcast', {
            rssURL: rssURL
        }).then(function(podcast) {
            console.info('Podcast already exists', podcast.objectAt(0));

            controller.set('isAdding', false);
            controller.set('rssURL', '');
            controller.transitionToRoute('podcast', podcast.objectAt(0));
        }, function() {
            console.info('Creating new podcast.');

            var podcast = controller.store.createRecord('podcast', {
                rssURL: rssURL
            });

            podcast.update().then(function() {
                controller.set('isAdding', false);
                controller.set('rssURL', '');
                controller.transitionToRoute('podcast', podcast);
            }, function() {
                controller.set('isAdding', false);
                controller.set('isInErrorState', true);
            });
        });
    },

    actions: {
        create: function(url) {
            if (url) {
                this.set('rssURL', url);
            }

            if (!this.get('rssURL') || !this.get('rssURL').length) {
                return;
            }

            // If the URL entered doesn't have a protocol attached, make
            // sure one is added so we don't get an error (#43).
            if (!this.get('rssURL').match(/^http[s]?:\/\//i)) {
                this.set('rssURL', 'http://' + this.get('rssURL'));
            }

            this.set('isAdding', true);

            this._createFromController(this, this.get('rssURL'));
        }
    }
});
