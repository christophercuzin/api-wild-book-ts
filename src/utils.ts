import { DataSource } from "typeorm";
import { WildersEntity } from "./entity/WildersEntity";
import { SkillsEntity } from "./entity/SkillsEntity";
import { GradesEntity } from "./entity/GradesEntity";

export const dataSource = new DataSource({
  type: "sqlite",
  database: "wildersdb.sqlite",
  synchronize: true,
  entities: [WildersEntity, SkillsEntity, GradesEntity],
});
