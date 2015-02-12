$(window).scroll(function() {
// 100 = The point you would like to fade the nav in.
  if ($(window).scrollTop() > 0 ){
    $('html').addClass('trans');
  } else {
    $('html').removeClass('trans');
  };
});
