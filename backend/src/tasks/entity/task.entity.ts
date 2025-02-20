import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'enum', enum: ['pendiente', 'en progreso', 'completado'], default: 'pendiente' })
  estado: string;

  @Column()
  usuario_id: number;

   @Column({ type: 'date' }) 
  fecha_limite: Date;

  @Column({ nullable: true }) 
  archivo?: string;
}
