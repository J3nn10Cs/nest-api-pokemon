import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/paginationDto.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit : number
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>,

    //inject ConfigService to access environment variables
    private readonly configService : ConfigService
  ) {

    this.defaultLimit = this.configService.get<number>('defaultLimit')!

  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      
      return pokemon;

    } catch (error) {
      this.handleExceptions(error);
    }
    
  }

  async findAll(paginationDto : PaginationDto) {
    const { limit = this.defaultLimit, page } = paginationDto;

    const totalPage = await this.pokemonModel.countDocuments();

    //last page
    const lastPage = Math.ceil(totalPage / limit);

    if(page > lastPage){
      throw new NotFoundException(`Page #${page} not exists. Total pages: ${lastPage}`);
    }

    const data = await this.pokemonModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ no: 'asc' });

    return {
      data,
      meta : {
        page,
        totalPage,
        lastPage
      }
    }
  }

  async findOne(term: string) {

    const pokemon = await this.pokemonModel.findOne({
      $or: [
        //buscar por no
        ...(!isNaN(+term) ?
          [{ no: term }] : 
          []),
        //buscar por id
        ...(isValidObjectId(term) ? 
        [{ _id: term }] : 
        []),
        //buscar por nombre
        { name: term.toLowerCase().trim() },
      ],
    });
 
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name or no '${term}' not found`,
      );
 
    return pokemon;
    
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    try {
      if(updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
  
      const updatePoke = await this.pokemonModel.findOneAndUpdate(
        { _id: pokemon._id },
        updatePokemonDto,
        {
          new: true,
        },
      )

      return updatePoke;
      
    } catch (error) {
      
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id '${id}' not found`);
    }

    return {
      message: `Pokemon with id '${id}' deleted successfully.`,
    };
  }

  private handleExceptions(error : any){
    //en caso ya exista un pokemon con el mismo nombre-no
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon with name ${JSON.stringify(error.keyValue)} already exists.`);
    }
    
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs for details.`);
  }
}
