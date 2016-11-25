$(".fv-like-button").on('click', function() {
  $.post('/like', function(data) {
    $('.fv-like-button').text('LIKES: ' + data.likeCount);
  });
});
