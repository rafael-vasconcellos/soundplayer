Player customizável com query parameters para ser incorporado em sites e etc. Construído com NextJS, tailwindcss, jsdom, hls e etc. É possível fornecer a playlist a ser exibida  (por hora, apenas playlists funcionam), customizar a cor do player e as artworks, tanto do álbum, quanto das músicas.

Mais instruções sobre como usar os query parameters estão na [rota home](https://soundplayer.vercel.app/)

## Variáveis de ambiente
3 são usadas:

**API_TRACK_URL:** path para uma das chamadas de API, aquela que retorna tracks a partir de ids passados  
**API_QUERY_PARAMS:** query parameters que serão usados em cada chamada de API  
**API_KEY**