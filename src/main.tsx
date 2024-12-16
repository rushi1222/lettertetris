import './createPost.js';
import { Devvit, useState } from '@devvit/public-api';
import data from './data.json'; // Import Pokémon data from data.json

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: 'getPokemon';
      data: { name: string };
    }
  | {
      type: 'sendPokemon';
      data: { pokemon: any };
    };

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Pokemon Viewer',
  height: 'tall',
  render: (context) => {
    // State for the currently selected Pokémon
    type Pokemon = {
      id: number;
      name: string;
      image: string;
      types: string[];
      region: string;
      abilities: string[];
      notable_moves: string[];
    };

    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    // State for controlling web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // Handle messages from the Web View
    const onMessage = (msg: WebViewMessage) => {
      if (msg.type === 'getPokemon') {
        const { name } = msg.data;

        // Find Pokémon by name in data.json
        const pokemonData = data.find((p) => p.name.toLowerCase() === name.toLowerCase());

        if (pokemonData) {
          // Send the Pokémon data back to the Web View
          context.ui.webView.postMessage('myWebView', {
            type: 'sendPokemon',
            data: { pokemon: pokemonData },
          });

          // Update local state to display Pokémon details
          setPokemon(pokemonData);
        } else {
          context.ui.webView.postMessage('myWebView', {
            type: 'sendPokemon',
            data: { pokemon: null },
          });
        }
      }
    };

    // When the button is clicked, open the web view
    const onShowWebviewClick = () => {
      setWebviewVisible(true);
    };

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? '0%' : '100%'}
          alignment="middle center"
        >
          <text size="xlarge" weight="bold">
            Pokémon Viewer
          </text>
          {pokemon ? (
            <vstack>
              <text size="large" weight="bold">{pokemon.name}</text>
              <text size="medium">Type: {pokemon.types.join(', ')}</text>
              <text size="medium">Region: {pokemon.region}</text>
              <text size="medium">Abilities: {pokemon.abilities.join(', ')}</text>
              <text size="medium">Notable Moves: {pokemon.notable_moves.join(', ')}</text>
            </vstack>
          ) : (
            <text size="medium">Search for a Pokémon to see its details.</text>
          )}
          <spacer />
          <button onPress={onShowWebviewClick}>Launch Webview</button>
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? '100%' : '0%'}>
          <vstack border="thick" borderColor="black" height={webviewVisible ? '100%' : '0%'}>
            <webview
              id="myWebView"
              url="challenge.html"
              onMessage={(msg) => onMessage(msg as WebViewMessage)}
              grow
              height={webviewVisible ? '100%' : '0%'}
            />
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
