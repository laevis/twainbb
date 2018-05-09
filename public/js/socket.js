$(document).ready(function() {
    var socket = io();

    socket.connect('http://localhost:8000/');

    socket.on('new post', function(json) {
    	var parsed = JSON.parse(json);

    	setTimeout(function() {
            console.log(parsed.new_val.title);
    		$('.main .topics > ul').prepend($('<li><div class="new">NEW</div> <a href=""> <div class="content"> <div class="title"> '+parsed.new_val.title+' <small><i class="far fa-user"></i> <b>Akke</b> posted 10 minutes ago</small> </div> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation...</p> </div> </a> <ul class="stats"> <li><i class="fa fa-comment-alt"></i> 10</li> <li><i class="fa fa-eye"></i> 10</li> <li rel="tooltip" title="Live readers"><i class="fa fa-podcast"></i> 10</li> <li> <i class="fa fa-tags"></i> <a href=""><div class="tab" style="background:#E74C3C">Add-ons</div></a> <a href=""><div class="tab" style="background:#87D37C">Help</div></a> </li> </ul> </li>'));
    	}, 500)
    });
});
