import { Injectable } from '@nestjs/common';
import { IPokemon } from './interface/pokemon.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    //inject the AxiosAdapter to use the get method
    private readonly http : AxiosAdapter,
  ){}
  
  //regiser the simulation of the seed command
  async executeSeed() {

    //eliminar todos os pokemons
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<IPokemon>('https://pokeapi.co/api/v2/pokemon?limit=10');
    
    const pokemonToInsert : { name: string, no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');

      const no = +segments[segments.length - 2]

      pokemonToInsert.push({ name, no });
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return {
      message: 'Seed executed successfully',
    }
  }
}
