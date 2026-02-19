import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Coco' })
  title: string;
}
