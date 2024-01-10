document.addEventListener("DOMContentLoaded", function () {
  const pokedexList = document.getElementById("pokedex-list");
  const pokemonDetails = document.getElementById("pokemon-details");
  const searchInput = document.getElementById("search");

  let pokemonList = [];

  async function fetchPokemonList() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();
      pokemonList = data.results;
      displayPokemonList(pokemonList);
    } catch (error) {
      console.error("Error fetching Pokemon list:", error);
    }
  }

  function displayPokemonList(pokemonList) {
    pokedexList.innerHTML = "";
    pokemonList.forEach((pokemon) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(
                  pokemon.url
                )}.png" alt="${pokemon.name}">
                <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
            `;
      card.addEventListener("click", () => fetchPokemonDetails(pokemon.url));
      pokedexList.appendChild(card);
    });
  }

  async function fetchPokemonDetails(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      displayPokemonDetails(data);
      scrollToPokemonDetails();
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
    }
  }

  function displayPokemonDetails(pokemon) {
    pokemonDetails.innerHTML = `
        <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          pokemon.id
        }.png" alt="${pokemon.name}">
        <p>Number: ${pokemon.id}</p>
        <p>Height: ${pokemon.height / 10} m</p>
        <p>Weight: ${pokemon.weight / 10} kg</p>
        <p>Types: ${pokemon.types
          .map((type) => capitalizeFirstLetter(type.type.name))
          .join(", ")}</p>
        <p>Abilities: ${pokemon.abilities
          .map((ability) => capitalizeFirstLetter(ability.ability.name))
          .join(", ")}</p>
        <p>Stats:</p>
        <table>
            <thead>
                <tr>
                    <th>Stat</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                ${pokemon.stats
                  .map(
                    (stat) =>
                      `<tr><td>${capitalizeFirstLetter(
                        stat.stat.name
                      )}</td><td>${stat.base_stat}</td></tr>`
                  )
                  .join("")}
            </tbody>
        </table>
    `;
  }

  function scrollToPokemonDetails() {
    pokemonDetails.scrollIntoView({ behavior: "smooth" });
  }

  function getPokemonId(url) {
    const parts = url.split("/");
    return parts[parts.length - 2];
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemon = pokemonList.filter((pokemon) => {
      return (
        pokemon.name.includes(searchTerm) ||
        getPokemonId(pokemon.url).includes(searchTerm)
      );
    });
    displayPokemonList(filteredPokemon);
  });

  fetchPokemonList();
});
