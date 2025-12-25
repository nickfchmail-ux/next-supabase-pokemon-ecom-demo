import InfinitePokemonList from "./../_component/InfinitePokemonList";
export const metadata = {
  title: "About",
};

export default async function Page({ searchParams }) {
  const params = await searchParams;

  return (
    <div className=" bg-amber-500 ">
      <InfinitePokemonList species={params.species} />
    </div>
  );
}
