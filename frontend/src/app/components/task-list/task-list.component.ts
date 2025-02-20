import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  selectedFile: File | null = null;

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  /** todas las tareas del servicio */
  loadTasks(): void {
    this.taskService.getTasks().subscribe(
      (data: Task[]) => {
        this.tasks = data;
        this.cdr.detectChanges(); // Forzar actualización de vista
      },
      (error) => console.error("Error al cargar tareas:", error)
    );
  }

  openModal(task: Task): void {
    this.selectedTask = { ...task };
  }

  
  closeModal(): void {
    this.selectedTask = null;
    this.selectedFile = null;
  }

  /** 📂 Manejar selección de archivo */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  /** Actualizar  */
  updateTask(): void {
    if (!this.selectedTask) return;

    if (!this.selectedTask.titulo.trim() || !this.selectedTask.descripcion.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append('titulo', this.selectedTask.titulo);
    formData.append('descripcion', this.selectedTask.descripcion);
    formData.append('estado', this.selectedTask.estado);
    formData.append('fecha_limite', this.selectedTask.fecha_limite);

    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile);
    }

    if (this.selectedTask.id !== undefined) { 
      this.taskService.updateTask(this.selectedTask.id, formData).subscribe(
        () => {
          alert('✅ Tarea actualizada con éxito');
          this.loadTasks();
          this.closeModal();
        },
        (error) => console.error("Error al actualizar tarea:", error)
      );
    } else {
      console.error("❌ Error: La tarea no tiene un ID válido.");
    }
  }

  /** Eliminar  */
  deleteTask(id: number): void {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;

    this.taskService.deleteTask(id).subscribe(
      () => {
        alert('🗑️ Tarea eliminada con éxito');
        this.loadTasks();
      },
      (error) => console.error("Error al eliminar tarea:", error)
    );
  }

   /** Descargar 
   */
   downloadFile(filePath: string): void {
    if (!filePath) {
      console.error("No hay archivo para descargar.");
      return;
    }
  
    const url = `http://localhost:4300${filePath}`; // Ajusta la URL según tu backend
    saveAs(url, filePath.split('/').pop() || 'archivo');
  }
  

  /** Descargar tareas en Excel*/
  downloadTasksAsExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
    saveAs(data, "Lista_de_Tareas.xlsx");
  }
}
