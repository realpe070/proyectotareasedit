import { IsEnum, IsNotEmpty, IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsEnum(['pendiente', 'en progreso', 'completado'])
  estado: string;

  @IsNotEmpty()
  @IsDateString()
  fecha_limite: string;

  @IsNumber()
  usuario_id: number;
}
