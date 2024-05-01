$(function () {
  let username = prompt("Enter your username:");
  const socket = io();

  // Event handler for receiving the user count
  socket.on('user count', function (count) {
    $('#online-count').text(`Users Online: ${count}`);
  });

  // Event handler for receiving chat messages
  socket.on('chat message', function (msg) {
    $('#messages').append($('<li>').html(msg));
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  });

  // Event handler for receiving user joined notifications
  socket.on('user joined', function (msg) {
    $('#messages').append($('<li class="notification">').text(msg));
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  });

  // Event handler for receiving user left notifications
  socket.on('user left', function (msg) {
    $('#messages').append($('<li class="notification">').text(msg));
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  });

  // Event handler for submitting the chat message form
  $('form').submit(function () {
    const message = $('#m').val().trim();
    if (message !== '') {
      const timestamp = new Date().toLocaleTimeString();
      const formattedMessage = `<span class="user">${username}:</span> ${message} <span class="timestamp">${timestamp}</span>`;
      socket.emit('chat message', formattedMessage);
      $('#m').val('');
    }
    return false;
  });

  // Notify the server that the user has joined with their username
  if (username) {
    socket.emit('username', username); // Notify server about the username
  } else {
    username = "Guest";
  }

  // Event handler for when the user leaves the page
  window.addEventListener('beforeunload', function () {
    socket.emit('user left', username);
  });

  // Display error message if username is empty
  if (!username) {
    $('#messages').append($('<li class="error">').text('Invalid username. Please refresh and enter a valid username.'));
  }
});
