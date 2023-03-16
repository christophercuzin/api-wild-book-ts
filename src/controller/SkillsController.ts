import { dataSource } from "../utils";
import { SkillsEntity } from "../entity/SkillsEntity";
import { Request, Response } from "express";

export class SkillsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      await dataSource.getRepository(SkillsEntity).save(req.body);
      res.status(201).send("Skill created");
    } catch (error: any) {
      if (error.errno === 19) {
        res.status(409).send("This skill already exists");
      } else {
        res.status(400).send("Bad request");
      }
    }
  }

  async read(req: Request, res: Response): Promise<void> {
    try {
      const Skills = await dataSource.getRepository(SkillsEntity).find();
      res.send(Skills);
    } catch (error) {
      res.status(404).send("Skills not found");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const skill = await dataSource.getRepository(SkillsEntity).findOneBy({
        id: parseInt(req.params.id),
      });

      if (skill === null) {
         res.status(404).send("Skill not found");
         return
      }

      await dataSource
        .getRepository(SkillsEntity)
        .update(req.params.id, req.body);
      res.send("Skill updated");
    } catch (error: any) {
      if (error.errno === 19) {
        res.status(409).send("This skill already exists");
      } else {
        res.status(400).send("Bad request");
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const skill = await dataSource.getRepository(SkillsEntity).findOneBy({
        id: parseInt(req.params.id),
      });

      if (skill === null) {
         res.status(404).send("Skill not found");
         return
      }

      await dataSource.getRepository(SkillsEntity).delete(req.params.id);
      res.send("Skill deleted");
    } catch (error) {
      res.status(400).send("Bad request");
    }
  }
}

