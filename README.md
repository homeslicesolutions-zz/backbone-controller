Backbone.Controller
=============================================
No not Router, but an independent Controller

This new class is basically a wrapper or container of Views and Models acting like a "Manager" controlling and delegating tasks between Views and Models.  It helps decouple the dependencies between the View and Model.  Like the Backbone.View, this is to provide more consistency and structure for the module/app. When reading a Controller, it should display the workflow of that module showing how the pieces fit together between Models and Views. Lastly, it also acts like an interface to a particular module so that it should contain methods that represent a general task of that module.  More importantly, it doesn't inherit the "technical knowledge" of Models and Views which is data parsing and DOM manipulation resepectively (shouldn't contain any Underscore Collection/Array Methods or jQuery DOM Methods).  All it has under it's toolbelt is Backbone.Events so it can listen and act linking the tasks between the Models and View.  So yes, it adds an extra layer, but like every good "micro-manager", it always knows what's going on all the time.

Like the View, there is an event delegator.  In this context, it is Backbone.Events instead of jQuery events.  It has the same format: { Event Context: Method }.  This is help visually see how things are piped up.

Example:
This is the data what will be returned with "/api/clothes":
```js
[
  { "type": "Oxford button-up",    "color": "blue",   "size": "Large" },
  { "type": "Straight leg chinos", "color": "khaki",  "size": "30w 32l" },
  { "type": "Penny loafers",       "color": "brown",  "size": "10.5US" }
]
```

```js
// Models/Collection
var Clothes = Backbone.Collection.extend({
  url: '/api/clothes'
});

// View
var Closet = Backbone.View.extend({ 
  template: '<tr><td>{{type}}</td><td>{{color}}</td><td>{{size}}</td></tr>',
  el: '#closet', 
  append: function( pieceOfClothing ){
    this.$el.append( mustache.render( this.template, pieceOfClothing ) );
    this.trigger('append');
  }
});

// Controller
var StyleModule = Backbone.Controller.extend({
  
  clothesCollection: new Clothes(),
  closetView: new Closet(),

  events: {
    'sync    clothesCollection': 'alertSynced',
    'add     clothesCollection': 'appendToView',
    'append  closetView'       : 'alertAdded'
  },

  start: function() {
    this.clothesCollection.fetch();
  },

  alertSynced: function() {
    alert( JSON.stringify( this.clothesCollection.toJSON() ) );
  },

  appendToView: function( pieceOfClothing ) {
    this.closetView.append( pieceOfClothing );
  },

  alertAdded: function() {
    alert('New item in closet!');
  }

});

// Execute
var styleModule = new StyleModule();
styleModule.start();
// Will alert the data back and then three times "New item in closet!"

```

More examples and how to use coming soon.