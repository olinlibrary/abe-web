var main=function() {

    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
        // put your options and callbacks here
        weekends: true,
        // events: '/myfeed.php',
        //fake events to play with:
        events: [
           {
               title  : 'event1',
               start  : '2017-06-13',
               //rendering : "background",
               description : "blue",
           },
           {
               title  : 'event2',
               start  : '2017-06-05',
               end    : '2017-06-07',
               description : "blue",
               tag: "FWOP",
           },
           {
               title  : 'event3',
               start  : '2017-06-09T12:30:00',
               allDay : false, // will make the time show
               description : "blue",
               tag: "BAJA",
           }
       ],

        header: {
          left: 'title',
          center:'',
          right:'today prev,next'

        },
        eventRender: function(event, element) {
          if(event.tag === "FWOP"){
         element.css('background-color', event.description);
         element.css('border-color', event.description);
       }
       else if(event.tag === "BAJA"){
         element.css('background-color', 'red');
         element.css('border-color', 'red');
         //event.eventBackgroundColor = 'red'
         //event.rendering = "background"
       }
       },
    })

var customDropdown = `
<div class="btn-group">
<button type="button" class="fc-button fc-state-default fc-corner-left fc-corner-right dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
Action <span class="caret"></span>
</button>
<ul class="dropdown-menu">
<li><a href="#">Action</a></li>
<li><a href="#">Another action</a></li>
<li><a href="#">Something else here</a></li>
<li role="separator" class="divider"></li>
<li><a href="#">Separated link</a></li>
</ul>
</div>`

$('.fc-toolbar .fc-left').append(
    $(customDropdown)
        .on('click', function() {
          $('.dropdown-toggle').dropdown();
    })
);
}

$(document).ready(main);
