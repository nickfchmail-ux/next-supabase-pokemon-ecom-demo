"use client"

import { useQuery } from "@tanstack/react-query";
import { getPokemonAction } from "../../../_lib/actions";

export default function useGetPokemon() {

    const {data, isLoading:isLoadingPokemon, error:errorForLoadingPokemon}= useQuery({
        queryKey: ["pokemon"],
        queryFn: getPokemonAction
      });
      const pokemonList = data?.data

      return {pokemonList, isLoadingPokemon, errorForLoadingPokemon}
}
