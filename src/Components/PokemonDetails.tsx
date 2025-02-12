import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import PokemonAbilities from "./PokemonAbilities";

type Pokemon = {
    type: { type: { name: string } }[];
    weight: number;
    abilities: { ability: { name: string, url: string } }[];
};

type PokemonPopoverProps = {
    pokemon: Pokemon;
    children: React.ReactNode
};

const PokemonDetails = ({ pokemon, children }: PokemonPopoverProps) => {


    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "pokemon-popover" : undefined;

    return (
        <div 
            onDoubleClick={handleOpen} 
            className="cursor-pointer"
        >
            {children}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: anchorEl && anchorEl.getBoundingClientRect().top > window.innerHeight / 2 ? "top" : "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: anchorEl && anchorEl.getBoundingClientRect().top > window.innerHeight / 2 ? "bottom" : "top",
                    horizontal: "left",
                }}
                PaperProps={{
                    sx: { width: "300px" },
                }}
            >
                <div className="p-4">
                    <Typography><strong>Tipo:</strong> {pokemon.type.map(item => item.type.name).join(", ")}</Typography>
                    <Typography><strong>Peso:</strong> {pokemon.weight} kg</Typography>
                    <PokemonAbilities 
                        abilities={pokemon.abilities.map(item => ({
                            ability: { name: item.ability.name, url: item.ability.url }
                        }))} 
                    />
                </div>
            </Popover>
        </div>
    );
};

export default PokemonDetails;
