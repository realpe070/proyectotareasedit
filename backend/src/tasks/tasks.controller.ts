import { Controller, Get, Post, Patch, Param, Delete, UseInterceptors, UploadedFile, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createObjectCsvStringifier } from 'csv-writer';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  create(@Body() createTaskDto: CreateTaskDto, @UploadedFile() file?: Express.Multer.File) {
    const filePath: string | undefined = file ? `/uploads/${file.filename}` : undefined; 
    return this.tasksService.create(createTaskDto, filePath);
  }

  /**
   * Obtener todas las tareas
   */
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  /**
   * Obtener una tarea por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  /**
   * Actualizar tarea
   */
  @Patch(':id')
  @UseInterceptors(FileInterceptor('archivo', { 
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @UploadedFile() file?: Express.Multer.File) {
    const filePath: string | undefined = file ? `/uploads/${file.filename}` : undefined; 
    return this.tasksService.update(+id, updateTaskDto, filePath);
  }

  /**
   * Eliminar tarea
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  /**
   * Descargar tareas en CSV
   */
  @Get('download')
  async downloadTasks(@Res() res: Response) {
    const tasks = await this.tasksService.findAll();
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'title', title: 'Título' },
        { id: 'description', title: 'Descripción' },
      ],
    });

    const csvData = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(tasks);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks.csv"');
    res.send(csvData);
  }
}
