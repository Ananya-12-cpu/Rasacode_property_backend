import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'dbo' })
export class Role {
  @PrimaryGeneratedColumn()
  Id: number;

  @Column()
  Name: string;
}
