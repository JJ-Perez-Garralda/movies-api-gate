import { Controller, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MovieDto } from './entities/movie.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOkResponse({ type: MovieDto, isArray: true })
  findAll() {
    return this.moviesService.findAll();
  }
}
