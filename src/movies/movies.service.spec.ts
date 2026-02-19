import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(MoviesService);
    repo = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll() devuelve lo que devuelve el repo', async () => {
    const data: Movie[] = [
      { id: 1, title: 'Coco' } as Movie,
      { id: 2, title: 'Toy Story' } as Movie,
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(data);

    const result = await service.findAll();
    expect(result).toEqual(data);
  });

  it('create() should insert a new movie', async () => {
    const dto = { id: 1, title: 'New Movie' };
    const savedMovie = { ...dto } as Movie;

    jest.spyOn(repo, 'create').mockReturnValue(savedMovie);
    jest.spyOn(repo, 'save').mockResolvedValue(savedMovie);

    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(savedMovie);
    expect(result).toEqual(savedMovie);
  });

  it('findOne() should return a movie by ID', async () => {
    const movie = { id: 1, title: 'Found Movie' } as Movie;
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(movie);

    expect(await service.findOne(1)).toEqual(movie);
  });

  it('findOne() should throw NotFoundException if movie not found', async () => {
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('update() should update and return the movie', async () => {
    const dto = { title: 'Updated Title' };
    const movie = { id: 1, title: 'Updated Title' } as Movie;

    jest.spyOn(repo, 'update').mockResolvedValue({ affected: 1 } as any);
    jest.spyOn(service, 'findOne').mockResolvedValue(movie); // Mock internal call

    const result = await service.update(1, dto);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(movie);
  });

  it('remove() should delete a movie', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);
    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('remove() should throw NotFoundException if movie not found', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 0 } as any);
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
