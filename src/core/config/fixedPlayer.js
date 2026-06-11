export function getFixedPlayer() {
  return {
    group_name: import.meta.env.VITE_FIXED_PLAYER_GROUP_NAME || 'Okinawa',
    ai_player_name: import.meta.env.VITE_FIXED_PLAYER_NAME || 'okinawa_bot',
    ai_player_avatar:
      import.meta.env.VITE_FIXED_PLAYER_AVATAR ||
      'https://i0.wp.com/blog.janm.org/wp-content/uploads/2015/07/shisa-by-troy-williams-via-flickr.jpg?ssl=1',
    ai_player_description:
      import.meta.env.VITE_FIXED_PLAYER_DESCRIPTION || 'Bot de testes',
    ai_player_move_endpoint:
      import.meta.env.VITE_FIXED_PLAYER_MOVE_ENDPOINT ||
      'https://back-end-production-f7ba.up.railway.app/move',
    id: Number(import.meta.env.VITE_FIXED_PLAYER_ID || 216),
    games_played: 0,
    games_won: 0,
    games_lost: 0,
    average_move_time: null,
    player_access_token:
      import.meta.env.VITE_FIXED_PLAYER_ACCESS_TOKEN ||
      'W8K-wAaiLCO0LptJ9I2gGd3kLQ4bW8HZmlfZCVQZMsI',
  };
}