(function( $ ){ 
  'use strict' ;
  function PriorityList( options ){
    $.extend( this , options );

    this.element = document.querySelector( this.element );

    var $elem = $(this.element).
      on("dragstart",$.proxy( this.onDragStart, this )).
      on("dragenter",$.proxy( this.onDragEnter, this )).
      on("dragend"  ,$.proxy( this.onDragEnd  , this )).
      on("dragover" ,$.proxy( this.onDragOver , this )).
      on("drop"     ,$.proxy( this.onDrop     , this ));

    $elem.find(".priorityToggleContainer").on("click",$.proxy(this.onClickToggle,this));
  }

  $.extend( PriorityList.prototype , {
    onClickToggle:function(e){
      e.preventDefault();
      e.stopPropagation();
      if( this.isOpen() ){
        this.close();
      }else{
        this.open();
      }
    },
    isOpen : function(){
      return this.element.classList.contains( "open" );
    },
    open : function(){
      this.element.classList.remove("close");
      this.element.classList.add("open");
    } ,
    close : function(){
      this.element.classList.remove("open");
      this.element.classList.add("close");
    } ,
    onDragStart : function(e){
      var target = e.target ;
      this.draggingElement = target ;

      target.classList.add( "dragging" );
    },
    onDragEnd : function(e){
      this.draggingElement.classList.remove( "dragging" );
      this.draggingElement = null ;
    },
    onDrop : function(){
      console.log( arguments );
    },
    onDragOver : function(e){
      e.preventDefault();
    },
    onDragEnter: function(e){
      var target = e.target ;
      if( target.classList.contains( "priorityItem" ) && !target.classList.contains("dragging") ){
        $(target).after( this.draggingElement );
      }
    }
  });




  new PriorityList( { element : "#priorityContainer" } );
})(jQuery);
