import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { WildersEntity } from "../entity/WildersEntity";
import { SkillsEntity } from "../entity/SkillsEntity";

@Entity()
export class GradesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rate: number;

  @ManyToOne(() => WildersEntity, (wilder) => wilder.rates, {
    onDelete: "CASCADE",
  })
  wilder: WildersEntity;

  @ManyToOne(() => SkillsEntity, (skill) => skill.rates, {
    onDelete: "CASCADE",
  })
  skill: SkillsEntity;
}
