import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { GradesEntity } from "../entity/GradesEntity";
import { WildersEntity } from "../entity/WildersEntity";

@Entity()
export class SkillsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  name: string;

  @OneToMany(() => GradesEntity, (rate) => rate.skill)
  rates: GradesEntity[];

  @ManyToMany(() => WildersEntity, (wilder) => wilder.skills)
  wilders: WildersEntity[];
}
