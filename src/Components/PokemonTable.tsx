import { useEffect, useState } from "react";
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,TablePagination,Paper, Typography, CardMedia } from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import toast, { Toaster } from "react-hot-toast";
import PokemonSearch from "./PokemonSearch"
import PokemonDetails from "./PokemonDetails";



type Pokemon = {
    name: string
    type: [],
    weight: number,
    abilities: [],
    image: string
}

const headerStyle = {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#2D3748", 
    textTransform: "uppercase", 
}

const PokemonTable = () => {

    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [prevPage, setPrevPage] = useState<string | null>(null);
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const rowsPerPage = 10; 
    const [ pokeName, setPokename ] = useState('')
    const [pokemonsFiltered, setPokemonsFiltered] = useState<Pokemon[]>([]);
    


    // console.log(pokemons)


    const handleChangePage = async(_event: unknown, newPage: number) => {
        if (newPage > page && nextPage) {
            await getPokemons(nextPage);
        } else if (newPage < page && prevPage) {
            await getPokemons(prevPage);
        }
        setPage(newPage);
    };

    const getPokemons = async (url:string) => {
        try {
            const res = await axios.get(url)
            setCount(res.data.count)
            setNextPage(res.data.next)
            setPrevPage(res.data.previous)
            const pokemonList = res.data.results

            const dataPokemons = await Promise.all(
                pokemonList.map(async(pokemon:{name:string;url:string}) => {
                    const res = await axios.get(pokemon.url)
                    return {
                        name: res.data.name,
                        type: res.data.types,
                        weight: res.data.weight,
                        abilities: res.data.abilities,
                        image: res.data.sprites.other["official-artwork"].front_default,
                    }
                })
            )
            setPokemons(dataPokemons)
        } catch (error) {
            console.log(error)
        }
    }

    const handleFilter = () => {
        if(!pokeName){
            toast.error('debes ingresar el nombre de un pokemon',{style:{backgroundColor: '#CBD5E0', textTransform:'capitalize', textAlign:'center'}})
        }else{
            const promise = axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeName}`)
            toast.promise(
                promise,
                {
                    loading: 'buscando pokemons',
                    success: (res:AxiosResponse) => {
                        const pokemonData = {
                            name: res.data.name,
                            type: res.data.types,
                            weight: res.data.weight,
                            abilities: res.data.abilities,
                            image: res.data.sprites.other["official-artwork"].front_default,
                        };
                        setPokemonsFiltered([pokemonData])
                        return <>pokemon encontrado 🎉🎉</>
                    },
                    error: (error:AxiosError) => {
                        console.log(error)
                        setPokemonsFiltered([])
                        return <>{'lo sentimo no encontramos tu pokemon 😔'}</>
                    }
                },{style:{backgroundColor: '#CBD5E0', textTransform:'capitalize', textAlign:'center'}}
            )
        }
    }

    const handleErase = () => {
        setPokename('')
        setPokemonsFiltered([])
    }

    useEffect(
        () => {
            getPokemons('https://pokeapi.co/api/v2/pokemon?limit=10')
        },
        []
    )


    return (
        <div className="w-[60%] h-[90%] flex flex-col justify-center items-center gap-3 ">
            
            <PokemonSearch
                pokeName={pokeName} 
                setPokename={setPokename} 
                handleFilter={handleFilter} 
                handleErase={handleErase}
            />

            <Paper 
                sx={{ width: "70%", height: "85%", overflow: "hidden", display: "flex", flexDirection: "column",backgroundColor:'#CBD5E0' }}
                elevation={6}
            >
                <TableContainer sx={{ maxHeight: '90%' }}>
                    <Table stickyHeader aria-label="pokemon table">
                    <TableHead >
                        <TableRow>
                            <TableCell>
                                <Typography sx={headerStyle}>
                                    #
                                </Typography>
                            </TableCell>    
                            <TableCell>
                                <Typography sx={headerStyle}>
                                    nombres
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={headerStyle}>
                                    imagen
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {
                            (pokemonsFiltered.length > 0  && pokeName !== '' ? pokemonsFiltered : pokemons).map((pokemon,i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Typography className="capitalize" fontSize={16}>
                                            {i + 1}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography className="capitalize" fontSize={16}>
                                            {pokemon.name}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        <PokemonDetails pokemon={pokemon}>
                                            <CardMedia
                                                className="border border-gray-400 rounded-lg object-contain h-[100%] w-[50%]"
                                                component={'img'}
                                                image={pokemon.image}
                                                alt={pokemon.name}
                                                sx={{
                                                    width: 70,
                                                    height: 80,
                                                    objectFit: "contain"
                                                }}
                                            />
                                        </PokemonDetails>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    className="flex justify-center items-center font-bold"
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[]}
                />
            </Paper>
            <Toaster position="top-left" />
        </div>
    );
};

export default PokemonTable;
