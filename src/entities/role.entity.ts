import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'dbo', name: 'Roles' })
export class Role {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Name: string;
}
