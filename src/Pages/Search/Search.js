import { Tab, Tabs, TextField} from "@mui/material";
import Button from '@mui/material/Button';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import React,{useState, useEffect} from 'react'
import instance from "../../axios/axiosinstance";
import SingleContent from "../../components/SingleContent/SingleContent";
import CustomPagination from "../../components/Pagination/Pagination";
import SearchIcon from '@mui/icons-material/Search';
import "./Search.css";

const Search = () => {
  const [type, setType] = useState(0)
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [content, setContent] = useState()
  const [numOfPages, setNumOfPages] = useState()

  const theme = createTheme({
    palette:{
      mode:"dark",
      primary:{
        main: "#fff",
      },
    },
  })


  const fetchSearch =async() => {
    try {
      const { data } = await instance.get(
        `/search/${type ? "tv" : "movie"}?api_key=${
          process.env.REACT_APP_MY_MOVIE_DB_API
        }&language=en-US&query=${searchText}&page=${page}&include_adult=false`
      );
      setContent(data.results);
      setNumOfPages(data.total_pages);
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    window.scroll(0, 0);
    fetchSearch();
    // eslint-disable-next-line
  }, [type, page]);


  return (
    <div style={{display:"flex", margin: "15px 0"}}>
      <ThemeProvider theme={theme}>

        <div>
          <TextField
          style={{flex:1}}
          className="searchBox"
          label="Search"
          variant="filled"
          onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant='contained' style={{marginLeft: 10}} onClick={fetchSearch}>
            <SearchIcon/>
          </Button>
        </div> 

        <Tabs 
        value={type} 
        indicatorColor="primary" 
        textColor='primary'
        onChange={(event, newValue) => {
          setType(newValue);
          setPage(1);
        }}
        style={{paddingBottom: 5}}
        >
          <Tab style={{width: "50%"}} label="Search Movies"/>
          <Tab style={{width: "50%"}} label="Search Tv Series"/>
        </Tabs>
      </ThemeProvider>

      <div className="trending">
        {content &&
          content.map((c) => (
            <SingleContent
              key={c.id}
              id={c.id}
              poster={c.poster_path}
              title={c.title || c.name}
              date={c.first_air_date || c.release_date}
              media_type={type ? "tv": "movie"}
              vote_average={c.vote_average}
            />
          ))}
          {
           searchText && 
           !content &&
           (type ? <h2>No Series Found</h2>:<h2>No Movies Found</h2>) 
          }
      </div>
      {numOfPages> 1 && (
        <CustomPagination setPage={setPage} numOfPages={numOfPages} />
      )}
      
  </div>

  )
}

export default Search