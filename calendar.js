function customCalendar() {
  this.masterLabels = [];
  this.activeLabels = ['summer']; //add labels we want visible by default here
  this.dropdownLabels = []; //keeps track of what's in the dropdown because we repopulate frequently
  this.rendering = function(event, element) { /**runs every time events are rendered on the calendar (including when they're updated from the dropdown)*/
    //add the label to masterLabels if it isn't there when we render
    for(i=0; i<event.labels.length; i++){
      if (mycalendar.masterLabels.indexOf(event.labels[i]) < 0){
        mycalendar.masterLabels.push(event.labels[i])}
    };
    // if (mycalendar.masterLabels.indexOf(event.visibility) < 0){
    //   mycalendar.masterLabels.push(event.visibility)
    // };
    //if it isn't in activeLabels, remove it from the calendar
    // if (mycalendar.activeLabels.indexOf(event.visibility) < 0){
    //   return false
    // };
    var active = false
    for(i=0; i<event.labels.length; i++){
      if (mycalendar.activeLabels.indexOf(event.labels[i]) > -1){
        active = true
        break}
    };

    //set colors differently based on the label (will change in later iterations)
    if(event.visibility === "public"){
      element.css('background-color', 'blue');
      element.css('border-color', 'blue');
    }
    else if(event.visibility === "students"){
      element.css('background-color','red');
      //event.rendering = "background"
    };
    return active
  };
  this.filter = function (event){ /*if the event isn't in activeLabels, take it off the calendar (this is called by removeEvents)*/
    if (mycalendar.activeLabels.indexOf(event.visibility) < 0){
      return true
    }
    for(i=0; i=event.labels.length; i++){
      if (mycalendar.activeLabels.indexOf(event.labels[i]) > -1){
        return false}
    };
    return true
  };
  this.refreshFilters = function(toggledFilters){ /**called when a filter is toggled to add or remove it to activeLabels and refresh - can be called with [] to just refresh*/
    $('#calendar').fullCalendar('refetchEvents'); //remember! this doesn't work if you're using dummy events
    for (var i=0; i< toggledFilters.length; i++){
      var index = this.activeLabels.indexOf(toggledFilters[i]);
      if(index > -1){
        this.activeLabels.splice(index,1)
      }
      else{
        this.activeLabels.push(toggledFilters[i])
      };
      $('#calendar').fullCalendar('removeEvents', this.filter);
    };
  };
  this.populateDropdown = function(){ /**called whenever we change which events are shown in order to update the dropdown*/
    //console.log(mycalendar.masterLabels);
    console.log('populate') //this makes it easy to see how often we repopulate the dropdown which is TOO OFTEN
    if ($('#labels-dropdown-inner').length){
    for (var i=0; i < mycalendar.masterLabels.length; i++){
    if (mycalendar.dropdownLabels.indexOf(mycalendar.masterLabels[i]) < 0){ //only add it to dropdown if it isn't there already
    console.log('add')
    console.log(mycalendar.masterLabels[i])
      if (mycalendar.activeLabels.indexOf(mycalendar.masterLabels[i]) < 0){
        console.log('inactive')
        $('#labels-dropdown-inner').append(
          $('<li>').append(
          $('<a>').attr('href','#').text(mycalendar.masterLabels[i])).on('click', function(){ //what happens when you click on something in the dropdown
          $(this).toggleClass('active');
          mycalendar.refreshFilters([$(this).text()])
          })
        );
      }
      else{ //if it's just being added and it's already active, make it start active
      console.log('active')
        $('#labels-dropdown-inner').append(
          $('<li>').addClass('active').append(
          $('<a>').attr('href','#').text(mycalendar.masterLabels[i])).on('click', function(){
          $(this).toggleClass('active');
          mycalendar.refreshFilters([$(this).text()])
          })
        );
      }
      mycalendar.dropdownLabels.push(mycalendar.masterLabels[i]) //once you add it to the dropdown, add it to the list of stuff on the dropdown
    };

    }
  }
  };
  this.calendar = { /*calendar object full of settings to pass fullCalendar*/
       weekends: true,
       events: { //JSON settings
        //url: 'https://abeweb.herokuapp.com/calendarRead',
        url: 'http://192.168.32.64:3000/calendarRead',
        type: 'POST',
        error: function() {
            alert('there was an error while fetching events!');
          },
        },
       //fake events to play with:
      //  events: [
      //     {
      //         title  : 'event1',
      //         start  : '2017-06-13',
      //         //rendering : "background",
      //         labels : ['FWOP', 'Food'],
      //         visibility : "students",
      //     },
      //     {
      //         title  : 'event2',
      //         start  : '2017-06-05',
      //         end    : '2017-06-07',
      //         labels : ['BAJA'],
      //         visibility: "olin",
      //     },
      //     {
      //         title  : 'event3',
      //         start  : '2017-06-09T12:30:00',
      //         allDay : false, // will make the time show
      //         labels : ['BAJA', 'Food'],
      //         visibility: "public",
      //     }
      //   ],
       header: {
         left: 'title',
         center:'',
         right:'today prev,next'
       },
       eventRender: this.rendering,
       eventAfterAllRender: this.populateDropdown,
   };
  this.initCalendar = function(){ /*what it sounds like*/
    $('#calendar').fullCalendar(this.calendar)
  };
  this.makeDropdown = function(){ /*called after making the fullCalendar calendar to add a Bootstrap dropdown to the header*/
    $('.fc-toolbar .fc-left').append(
      $('<div>').attr('id','labels-dropdown'));
      $('#labels-dropdown').addClass('btn-group');
      $('#labels-dropdown').append(
        $('<button>').addClass('fc-button fc-state-default fc-corner-left fc-corner-right dropdown-toggle'));
      $('.dropdown-toggle').attr('type','button').attr('data-toggle','dropdown').attr('aria-haspopup', 'true').attr('aria-expanded','false');
      $('.dropdown-toggle').text('Choose a filter');
      $('.dropdown-toggle').append(
        $('<span>').addClass('caret')
      );
      $('#labels-dropdown').append(
        $('<ul>').attr('id','labels-dropdown-inner'));
      $('#labels-dropdown-inner').addClass('dropdown-menu');
  };
}
var mycalendar; //THIS IS IMPORTANT because JS sucks at handling classes
var main=function() {
  mycalendar = new customCalendar();
  mycalendar.initCalendar();
  console.log(mycalendar.dropdownLabels);
  mycalendar.makeDropdown();
  mycalendar.populateDropdown();
  console.log(mycalendar.dropdownLabels);
  mycalendar.refreshFilters([]);
}

$(document).ready(main);
