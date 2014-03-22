!function(_, Backbone){

  // Creating a "Controller" Plugin
  // Create new Controller
  var Controller = Backbone.Controller = function(options) {
    this.cid = _.uniqueId('control');
    this._configure(options || {});
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  }

  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // Attach Backbone Events and add functions
  _.extend( Controller.prototype, Backbone.Events, {

    initialize: function(){},

    start: function() { return this },

    _configure: function(options) {
      if (this.options) options = _.extend({}, _.result(this, 'options'), options);
      this.options = options;
    },

    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        
        var eventName = match[1], 
            context = match[2];

        method = _.bind(method, this);

        var listenMethod = eventName.indexOf(':once') >= 0 ? 'listenToOnce' : 'listenTo';
        eventName = eventName.replace(':once', '');

        if (context === '') {
          this[listenMethod]( this, eventName, method );
        } else {
          this[listenMethod]( this[context], eventName, method );
        }

      }
      return this;
    },

    undelegateEvents: function() {
      this.stopListening();
      return this;
    }

  });

  // Apply Extender Helper
  Controller.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  } 

  return Backbone;

}(_, Backbone);