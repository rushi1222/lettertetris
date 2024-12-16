class App {
  constructor() {
    const searchButton = document.getElementById('btn-search');
  const pokemonNameInput = document.getElementById('pokemon-name');
  const pokemonDetailsDiv = document.getElementById('pokemon-details');
  const messageOutput = document.getElementById('messageOutput');

  const nameDisplay = document.getElementById('pokemon-name-display');
  const image = document.getElementById('pokemon-image');
  const types = document.getElementById('pokemon-types');
  const region = document.getElementById('pokemon-region');
  const abilities = document.getElementById('pokemon-abilities');
  const moves = document.getElementById('pokemon-moves');

  // Listen for messages from main.tsx
  window.addEventListener('message', (ev) => {
    const { type, data } = ev.data;

    if (type === 'devvit-message') {
      const { message } = data;
      messageOutput.textContent = JSON.stringify(message, null, 2);

      if (message.type === 'sendPokemon') {
        const pokemon = message.data.pokemon;
        if (pokemon) {
          // Populate Pokémon details
          nameDisplay.textContent = pokemon.name;
          image.src = pokemon.image;
          types.textContent = pokemon.types.join(', ');
          region.textContent = pokemon.region;
          abilities.textContent = pokemon.abilities.join(', ');
          moves.textContent = pokemon.notable_moves.join(', ');

          pokemonDetailsDiv.style.display = 'block';
        } else {
          alert('Pokémon not found! Please try again.');
          pokemonDetailsDiv.style.display = 'none';
        }
      }
    }
  });

  // Send a message to main.tsx to fetch Pokémon data
  searchButton.addEventListener('click', () => {
    const pokemonName = pokemonNameInput.value.trim();
    if (pokemonName) {
      window.parent?.postMessage(
        {
          type: 'getPokemon',
          data: { name: pokemonName },
        },
        '*'
      );
    }
  });
  }
}

new App();
