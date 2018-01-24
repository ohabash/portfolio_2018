app.controller('notice', function ($scope, $location, Auth, $timeout, $route, $rootScope, $location) {
  $('#bell')[0].play();
  // console.log('NOTICE');
  var queue = [];
  var busy = false;
  $rootScope.notice = function(icon, title, desc) {

    // Enqueue
    queue.push({'icon': icon, 'title': title, 'desc': desc });
      if (!busy) {
        busy = true;
        fireAlerts(queue);
      }

    // Show
    function fireAlerts(alerts) {
      var $e = null;
      var len = alerts.length;
      $.each(alerts, function(index, value) {
        // Use IIFE to multiply Wait x Index (http://stackoverflow.com/a/5226335/922522)
        var rand = Math.floor((Math.random() * 100) + 1);
        (function(index, value) {
          var wait = index * 500 + 1000;
          var i = index;
          var self = alerts[i];
          setTimeout(function() {
            // Show Alert
            $e = "<div class=\"item2 rand-"+rand+" columns animated slideInRight\"> <div class=\"column icon\"><i class=\"fa fa-"+self.icon+"\" aria-hidden=\"true\"></i></div> <div class=\"column pl0 copy is-8\"> <p class=\"t\">"+self.title+"</p> <p class=\"m\">"+self.desc+"</p> </div> <div class=\"column actions\"> <div class=\"action close\">close</div> </div> </div>"
            $("#notices").append($e);
            $(".actions div").click( function(){
              removeAlert($(this).closest('.item2'))
            });
            $timeout( function(){removeAlert($('.rand-'+rand).closest('.item2')) },8000);
            // Remove displayed from queue
            queue.shift();
            // End of alerts array
            if (index === len - 1) {
              busy = false;
              // Are there more in the queue?
              if (queue.length > 0) {
                fireAlerts(queue);
              }
            }
          }, wait);
        })(index, value);
      });
    }

    // Hide
    // function removeAlert($e) {
    //   $e.removeClass('fadeInUp').addClass('fadeOutRight');
    //   setTimeout(function() {
    //     $e.remove();
    //   }, 3000);
    // }
    function removeAlert(e) {
      $('#swoosh')[0].volume = 0.3;
      $('#swoosh')[0].play();
      e.removeClass('slideInRight').addClass('slideOutRight').delay(400).queue(function(this1){
        this.remove();
      });
    }

  };
});