import Axios from "axios";

export interface IPokemonList {
  count: number;
  results: {
    id: number;
    name: string;
  }[];
}

export interface IPokemonDetail {
  name: string;
  order: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  species: {
    url: string;
    text: string;
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
    };
  }[];
}

interface IPokemonSpecie {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    };
  }[];
}

export default class PokemonService {
  public static async listPokemon(
    limit: number,
    offset: number
  ): Promise<IPokemonList> {
    const { data } = await Axios.get<IPokemonList>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    return {
      ...data,
      count: 151,
      results: data.results
        .map((r, i) => {
          return { ...r, id: offset + i + 1 };
        })
        .filter((r) => r.id <= 151),
    };
  }

  public static async getPokemon(id: number): Promise<IPokemonDetail> {
    const { data: pokemon } = await Axios.get<IPokemonDetail>(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );

    const { data: specie } = await Axios.get<IPokemonSpecie>(
      pokemon.species.url
    );

    pokemon.species.text = specie.flavor_text_entries.filter(
      (t) => t.language.name === "en"
    )[0].flavor_text;

    return pokemon;
  }
}
