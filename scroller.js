// https://github.com/vlandham/scroll_demo/blob/gh-pages/js/scroller.js

function scroller(){
    let container = d3.select('body')

    let dispatch = d3.dispatch('active', 'progress');
// d3 selection of all the
// text sections that will
// be scrolled through

    let sections = d3.selectAll('.step')
  // array that will hold the
  // y coordinate of each section
  // that is scrolled through
  
    let sectionPositions
   
    let currentIndex = -1
    let containerStart = 0;

    // when window is scrolled call
    // position. When it is resized
    // call resize.
    function scroll(){
        d3.select(window)
            .on('scroll.scroller', position)
            .on('resize.scroller', resize)

            // manually call resize
    // initially to setup
    // scroller.

        resize();

        let timer = d3.timer(function() {
            position();
            timer.stop();
        });
    }
  /**
   * resize - called initially and
   * also when page is resized.
   * Resets the sectionPositions
   *
   */
    function resize(){
        sectionPositions = [];
        let startPos;
    
        sections.each(function(d, i) {
            let top = this.getBoundingClientRect().top;
        
            if (i === 0 ){
                startPos = top;
            }
            sectionPositions.push(top - startPos)
        });
    }

      /**
   * position - get current users position.
   * if user has scrolled to new section,
   * dispatch active event with new section
   * index.
   *
   */


    function position() {
        let pos = window.pageYOffset - 300 - containerStart;
        let sectionIndex = d3.bisect(sectionPositions, pos);
        sectionIndex = Math.min(sections.size()-1, sectionIndex);
    
        if (currentIndex !== sectionIndex){
            dispatch.call('active', this, sectionIndex);
            currentIndex = sectionIndex;
        }
    
        let prevIndex = Math.max(sectionIndex - 1, 0);
        let prevTop = sectionPositions[prevIndex]
        let progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
        dispatch.call('progress', this, currentIndex, progress)
    }
  
//    * container - get/set the parent element
//    * of the sections. Useful for if the
//    * scrolling doesn't start at the very top
//    * of the page.
    scroll.container = function(value) {
        if (arguments.legth === 0){
            return container
        } 
        container = value 
        return scroll 
    }

    scroll.on = function(action, callback){
        dispatch.on(action, callback)
    };

    return scroll;
}

$.fn.followTo = function (pos) {
    var $this = this,
        $window = $(window);

    $window.scroll(function (e) {
        if ($window.scrollTop() > pos) {
            $this.css({
                position: 'absolute',
                top: pos
            });
        } else {
            $this.css({
                position: 'fixed',
                top: 0
            });
        }
    });
};

$('#wine').followTo(250);