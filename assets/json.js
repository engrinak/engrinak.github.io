$().ready(function(){
    $.get( "/assets/data.json", function( data ) {
    console.log(data);
    $("#text").html(data["text"]);
  });
});