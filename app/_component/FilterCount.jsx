function FilterCount({ displayedPokemon, totalCount, view }) {
  return (
    <p
      className={`${
        view === "mobile" ? "mt-3" : null
      } text-center min-w-max pb-2 sm:pb-2 md:pb-0 flex self-start ml-5 sm:ml-5 md:ml-0 text-white font-semibold justify-center items-center mr-2`}
    >
      Showing {displayedPokemon} of {totalCount} Pokémon
    </p>
  );
}

export default FilterCount;
