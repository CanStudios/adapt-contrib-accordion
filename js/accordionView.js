define([
  'core/js/views/componentView'
], function(ComponentView) {

  var AccordionView = ComponentView.extend({

    events: {
      'click .js-toggle-item': 'onClick'
    },

    preRender: function() {
      // Checks to see if the accordion should be reset on revisit
      this.checkIfResetOnRevisit();

      this.model.resetActiveItems();

      this.listenTo(this.model.get('_children'), {
        'change:_isActive': this.onItemsActiveChange,
        'change:_isVisited': this.onItemsVisitedChange
      });
    },

    postRender: function() {
      this.setReadyStatus();
    },

    checkIfResetOnRevisit: function() {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    onClick: function(event) {
      event.preventDefault();

      this.model.toggleItemsState($(event.currentTarget).parent().data('index'));
    },

    onItemsActiveChange: function(item, isActive) {
      this.toggleItem(item, isActive);
    },

    onItemsVisitedChange: function(item, isVisited) {
      if (!isVisited) return;

      var $item = this.getItemElement(item);

      $item.children('.m-accordion__item-title').addClass('--is-visited');
    },

    toggleItem: function(item, shouldExpand) {
      var $item = this.getItemElement(item);
      var $body = $item.children('.m-accordion__item-body').stop(true, true);

      $item.children('.m-accordion__item-title')
        .toggleClass('--is-selected', shouldExpand)
        .attr('aria-expanded', shouldExpand);
      $item.children('.m-accordion__item-title')
        .toggleClass('--is-closed', !shouldExpand)
        .toggleClass('--is-open', shouldExpand);

      if (!shouldExpand) {
        $body.slideUp(this.model.get('_toggleSpeed'));
        return;
      }

      $body.slideDown(this.model.get('_toggleSpeed'), function() {
        $body.a11y_focus();
      });
    },

    getItemElement: function(item) {
      var index = item.get('_index');

      return this.$('.m-accordion__item').filter('[data-index="' + index +'"]');
    }

  });

  return AccordionView;

});
