const useGenres =(selectedGenres) => {
   if(selectedGenres.length < 1) return "";
   
   const GenresIds = selectedGenres.map((gen) => gen.id)
   return GenresIds.reduce((acc, curr)=> acc + "," + curr) 
}


export default useGenres;