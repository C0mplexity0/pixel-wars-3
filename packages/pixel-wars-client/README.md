# PIXEL WARS CLIENT

This is the module for the client functionality. All of the code here manages rendering the canvas, displaying the UI on the screen (through React), connectivity to multiplayer servers, and inputs.

## Singleplayer

Singleplayer mode works by starting a local instance of pixel-wars-core. This handles all game logic, such as managing worlds and players. The singleplayer instance of this is very bare-bones and is only meant for basic building on an infinite world.

## Multiplayer

Multiplayer mode works by connecting to a server (running pixel-wars-server), which then sends information between the client and the core (pixel-wars-core). The server can then manage the core game logic, and also manage multiple players at once.
