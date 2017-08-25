jQuery(function($){
    var socket = io.connect();
    var $nameForm = $('#send_name');
    var $messageForm = $('#send_message');
    var $name = $('#user_name');
    var $currentNameHolder = '';
    var $currentUser = $('#current_user');
    var $secretName = $('#secret_name');
    var $nameError = $('#name_error');
    var $usersOnline = $('#usersonline');
    var $messageBox = $('#message');
    var $chat = $('#chat');
    
    $('#clear').click(function(e){
        e.preventDefault();
        $('#send_name, #send_message')[0].reset();
        //$('')[0].reset();
    });
    
    $nameForm.submit(function(e){
        e.preventDefault();
        $currentNameHolder = $name.val();
        socket.emit('new user', $name.val(), function(data){
            if(data){
                $('#name_row').hide();
                $('#message_row').show();
            } else {
                $('#name_error').html('Name taken! try another one.');
            }
            
        });
        $name.val('');
    });
    
    $messageForm.submit(function(e){
        e.preventDefault();
        if($secretName.val() != ""){
            
            socket.emit('send message', {secretname: $secretName.val(), secretmsg: $messageBox.val()}, function(data){
                $chat.append("<span class='err_msg'><i>"+ data+"</i></span><br>");
            });
            $messageBox.val('');
        }
        else{
            
            socket.emit('send message', $messageBox.val());
            $messageBox.val('');
        }
        
    });
    
    socket.on('new message', function(data){
        $chat.append("<b>"+ data.msg_user +": </b>"+ data.msg + "<br>");
    });
    
    socket.on('secret message', function(data){
        $chat.append("<span class='sec_msg'><i><b>(Private) "+ data.msg_user +": </b>"+ data.msg +" </i></span><br>" );
    });
    
    socket.on('online users', function(data){
        var user = '';
        for(i=0; i<data.length; i++){
            user += data[i] + '<br>';
        }
        $usersOnline.html(user);
        $('#chatstatus').html('Your name: '+ $currentNameHolder);
    });
});