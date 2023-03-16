import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { GradesEntity } from "../entity/GradesEntity";
import { SkillsEntity } from "../entity/SkillsEntity";

@Entity()
export class WildersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  city: string;

  @OneToMany(() => GradesEntity, (rate) => rate.wilder)
  rates: GradesEntity[];

  @ManyToMany(() => SkillsEntity, (skill) => skill.wilders, {
    eager: true,
  })
  @JoinTable()
  skills: SkillsEntity[];
}
