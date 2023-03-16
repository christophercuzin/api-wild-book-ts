import { dataSource } from "../utils";
import { WildersEntity } from "../entity/WildersEntity";
import { SkillsEntity } from "../entity/SkillsEntity";
import { Request, Response } from "express";

export class WildersController {
  
  async create(req: Request, res: Response): Promise<void> {
    try {
      await dataSource.getRepository(WildersEntity).save(req.body);
      res.status(201).send("wilder created");
    } catch (error) {
      if ((error as { errno: number }).errno === 19) {
        res.status(409).send("email: this value is already used");
      } else {
        res.status(400).send("Bad request");
      }
    }
  }

  async read(req: Request, res: Response): Promise<void> {
    try {
      const wilders = await dataSource.getRepository(WildersEntity).find();
      res.send(wilders);
    } catch (error) {
      res.status(404).send("Wilders not found");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const wilder = await dataSource.getRepository(WildersEntity).findOneBy({
        id: parseInt(req.params.id),
      });

      if (wilder === null) {
        res.status(404).send("Wilder not found");
        return;
      }

      await dataSource
        .getRepository(WildersEntity)
        .update(req.params.id, req.body);
      res.send("Wilder updated");
    } catch (error) {
      res.status(400).send("Bad request");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const wilder = await dataSource.getRepository(WildersEntity).findOneBy({
        id: parseInt(req.params.id),
      });

      if (wilder === null) {
        res.status(404).send("Wilder not found");
        return;
      }

      await dataSource.getRepository(WildersEntity).delete(req.params.id);
      res.send("Wilder deleted");
    } catch (error) {
      res.status(400).send("Bad request");
    }
  }

  async addSkill(req: Request, res: Response): Promise<void> {
    try {
      const wilder = await dataSource.getRepository(WildersEntity).findOneBy({
        id: parseInt(req.params.wilderId),
      });

      if (wilder === null) {
        res.status(404).send("Wilder not found");
        return;
      }
      const skillToAdd = await dataSource
        .getRepository(SkillsEntity)
        .findOneBy({
          id: parseInt(req.params.skillId),
        });

      if (skillToAdd === null) {
        res.status(404).send("Skill not found");
        return;
      }

      const existingSKill = (): boolean => {
        for (const wilderSkill of wilder.skills) {
          if (wilderSkill.id === skillToAdd.id) {
            return true;
          }
        }
        return false;
      };

      if (existingSKill()) {
        res
          .status(409)
          .send("This skill has already been added to this wilder");
        return;
      }

      wilder.skills = [...wilder.skills, skillToAdd];
      await dataSource.getRepository(WildersEntity).save(wilder);
      res.send("Skill added to wilder");
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async deleteSkill(req: Request, res: Response): Promise<void> {
    try {
      // On récupère le wilder à modifier
      const wilder = await dataSource.getRepository(WildersEntity).findOneBy({
        id: parseInt(req.params.wilderId),
      });
      if (wilder === null) {
        res.status(404).send("Wilder not found");
        return;
      }
      // On récupère la skill à supprimer
      const skillToRemove = await dataSource
        .getRepository(SkillsEntity)
        .findOneBy({ id: parseInt(req.params.skillId) });
      if (skillToRemove === null) {
        res.status(404).send("Skill not found");
        return;
      }
      // Oon filtre les skill a persiter
      wilder.skills = wilder.skills.filter((skill) => {
        return skill.id !== skillToRemove.id;
      });
      // On sauvegarde le wilder
      await dataSource.getRepository(WildersEntity).save(wilder);

      // On renvoie une réponse
      res.send("Skill removed from wilder");
    } catch {
      res.status(500).send("error while deleting skill to wilder");
    }
  }
}
