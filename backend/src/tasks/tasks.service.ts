import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, filePath?: string) {
    const task = this.taskRepository.create({
      ...createTaskDto,
      archivo: filePath,
      fecha_limite: createTaskDto.fecha_limite ? new Date(createTaskDto.fecha_limite) : undefined, // Evita null
    });    
    return this.taskRepository.save(task);
  }

  async findAll() {
    return this.taskRepository.find();
  }

  async findOne(id: number) {
    return this.taskRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, filePath?: string) {
    const taskToUpdate = await this.taskRepository.findOne({ where: { id } });
    if (!taskToUpdate) return null;

    taskToUpdate.titulo = updateTaskDto.titulo ?? taskToUpdate.titulo;
    taskToUpdate.descripcion = updateTaskDto.descripcion ?? taskToUpdate.descripcion;
    taskToUpdate.estado = updateTaskDto.estado ?? taskToUpdate.estado;

    taskToUpdate.fecha_limite = updateTaskDto.fecha_limite 
      ? new Date(updateTaskDto.fecha_limite)
      : taskToUpdate.fecha_limite;

  
    if (filePath) {
      taskToUpdate.archivo = filePath;
    }

    return this.taskRepository.save(taskToUpdate);
  }

  async remove(id: number) {
    const taskToDelete = await this.taskRepository.findOne({ where: { id } });

    if (!taskToDelete) return { deleted: false, message: 'Tarea no encontrada' };


    if (taskToDelete.archivo) {
      console.log(`Archivo asociado eliminado: ${taskToDelete.archivo}`);
    }

    await this.taskRepository.delete(id);
    return { deleted: true };
  }
}
