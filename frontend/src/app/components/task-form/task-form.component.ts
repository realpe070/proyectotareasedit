import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // 🔥 SOLUCIÓN: Importar HttpClientModule
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  task: Task = {
    titulo: '',
    descripcion: '',
    estado: 'pendiente',
    fecha_limite: '',
    usuario_id: 1
  };

  selectedFile: File | null = null; //Almacenar 

  constructor(private taskService: TaskService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  saveTask(): void {
    const formData = new FormData();
    formData.append('titulo', this.task.titulo);
    formData.append('descripcion', this.task.descripcion);
    formData.append('estado', this.task.estado);
    formData.append('fecha_limite', this.task.fecha_limite);
    formData.append('usuario_id', this.task.usuario_id.toString());

    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile); // archivo
    }

    this.taskService.createTask(formData).subscribe((newTask) => {
      alert('Tarea creada con éxito');
      this.task = { titulo: '', descripcion: '', estado: 'pendiente', fecha_limite: '', usuario_id: 1 };
      this.selectedFile = null;
      window.location.reload();
    });
  }
}
