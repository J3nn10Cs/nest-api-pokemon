import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  limit : number = 10;

  @IsInt()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page : number;
}
