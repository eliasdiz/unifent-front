import { useState } from "react";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";

type Ability = {
    ability: { name: string; url: string };
};

type PokemonAbilitiesProps = {
    abilities: Ability[];
};

type EffectEntry = { 
    language: { name: string }; effect: string 
    short_effect: string
};


const PokemonAbilities = ({ abilities }: PokemonAbilitiesProps) => {

    const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
    const [effect, setEffect] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const getEffect = async (url:string) => {
        setLoading(true)
        setEffect(null)
        try {
            const res = await axios.get(url)
            const allEffects: EffectEntry[] = res.data.effect_entries;
            const englishEffect = allEffects.find((item) => item.language.name === "en");
            setEffect(englishEffect ? englishEffect.short_effect : 'No hay efectos en inglés');
        } catch (error) {
            console.log(error)
        }finally{
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        }
    }


    return (
        <div>
            <Typography><strong>Habilidades:</strong></Typography>
            <ul>
                {
                    abilities.map((item,i) => (
                        <li key={i} className="cursor-pointer text-blue-500 hover:underline" 
                            onClick={async() => {
                                setSelectedAbility(item.ability.name);
                                await getEffect(item.ability.url);
                            }}
                        >
                            {item.ability.name}
                        </li>
                    ))
                }
            </ul>

            {
                selectedAbility && (
                    <div className="w-[90%] mt-2 p-2 border rounded bg-gray-100">
                        <Typography><strong>{selectedAbility}:</strong></Typography>
                        {loading ? <CircularProgress size={20} /> : <Typography>{effect}</Typography>}
                    </div>
                )
            }
        </div>
    );
};

export default PokemonAbilities;
