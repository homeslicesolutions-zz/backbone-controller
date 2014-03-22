Backbone.Controller (a different perspective)
=============================================
No not Router, but an actual Controller

This new class basically sits between the View and Model and acts as sort of the "manager" of the two worlds as a Controller should.  When reading a Controller class, it should display the workflow of that module showing how the pieces fit together between Models and Views. Lastly, it also acts like an interface to a particular module so that it should contain methods that represent a general task of that module.  More importantly, it doesn't inherit the "technical knowledge" of Models and Views which is data parsing and DOM manipulation resepectively (shouldn't contain any Underscore or jQuery).  All it has under it's toolbelt is Backbone.Events so it can listen and act linking the tasks between the Models and View.  So yes it adds an extra layer, but like every good micro-manager, it always knows what's going on all the time.

Like the View, there is an event delegator.  In this context, it is Backbone.Events.  It has the same format: { Event Context: Method }.

```js
// Models
var clothes = new Backbone.Collection();

clothes.add( new Backbone.Model({ type: 'Oxford button-up',    color: 'blue',   size: 'Large' }) );
clothes.add( new Backbone.Model({ type: 'Straight leg chinos', color: 'khaki',  size: '30w 32l' }) );
clothes.add( new Backbone.Model({ type: 'Penny loafers',       color: 'brown',  size: '10.5US' }) );

// View
var Closet = Backbone.View.extend({ 
  template: '<tr><td>{{type}}</td><td>{{color}}</td><td>{{size}}</td></tr>',
  el: '#closet', 
  append: function( pieceOfClothing ){
    this.$el.append( mustache.render( this.template, pieceOfClothing ) );
    this.trigger('append');
  }
});
var closet = new Closet();

// Controller
var StyleModule = Backbone.Controller.extend({
  
  clothesCollection: new Backbone.Collection(),
  closetView: new Closet(),

  events: {
    'add     clothesCollection': 'appendToView',
    'append  closetView'       : 'alertAdded'
  },

  start: function() {
    this.clothesCollection.add( new Backbone.Model({ type: 'Oxford button-up',    color: 'blue',   size: 'Large' }) );
    this.clothesCollection.add( new Backbone.Model({ type: 'Straight leg chinos', color: 'khaki',  size: '30w 32l' }) );
    this.clothesCollection.add( new Backbone.Model({ type: 'Penny loafers',       color: 'brown',  size: '10.5US' }) );
  },

  appendToView: function( pieceOfClothing ) {
    this.closetView.append( pieceOfClothing );
  },

  alertAdded: function() {
    alert('New item in closet!')
  }

});

// Execute
var styleModule = new StyleModule();
styleModule.start();

```

More examples and how to use coming soon.