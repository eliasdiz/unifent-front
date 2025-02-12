import { OutlinedInput, InputAdornment } from "@mui/material";
import { MagnifyingGlassPlus, Trash } from "@phosphor-icons/react";

type PokemonSearchProps = {
    pokeName: string;
    setPokename: (name: string) => void;
    handleFilter: () => void
    handleErase: () => void
};

const PokemonSearch = ({ pokeName, setPokename, handleFilter, handleErase }: PokemonSearchProps) => {
    return (
        <div className="flex items-center gap-2">
            <OutlinedInput
                placeholder="Busquemos Un Pokemon"
                size="small"
                sx={{ color: "white" }}
                onChange={(e) => setPokename(e.target.value.toLowerCase())}
                value={pokeName}
                endAdornment={
                    <InputAdornment position="start">
                        {pokeName !== "" && (
                            <Trash
                                onClick={handleErase}
                                className="cursor-pointer"
                                size={20}
                                color="orange"
                                weight="duotone"
                            />
                        )}
                    </InputAdornment>
                }
            />

            <MagnifyingGlassPlus
                onClick={handleFilter}
                size={35}
                color="white"
                weight="duotone"
                className="cursor-pointer"
            />
        </div>
    );
};

export default PokemonSearch;
