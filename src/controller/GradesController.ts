import { dataSource } from "../utils";
import { GradesEntity } from "../entity/GradesEntity";
import { WildersEntity } from "../entity/WildersEntity";
import { SkillsEntity } from "../entity/SkillsEntity";
import { Request, Response } from "express";

export class GradesController {
  async create(req: Request, res: Response): Promise<void> {
    const { rate } = req.body;
    const { wilderId, skillId } = req.params;
    
    const wilder = await dataSource.getRepository(WildersEntity).findOneBy({
      id: parseInt(wilderId),
    });

    if (wilder === null) {
      res.status(404).send("Wilder not found");
      return;
    }

    const wilderSkill = (): SkillsEntity | null => {
      if (wilder != null)
        for (const wilderSkill of wilder.skills) {
          if (wilderSkill.id === parseInt(skillId)) {
            return wilderSkill;
          }
        }
      return null;
    };
    const skill = wilderSkill();
    if (skill === null) {
      res.status(404).send("Wilder's skill not found");
    }
    

    try {
      if (skill != null) {
        await dataSource.getRepository(GradesEntity).save({
          rate,
          wilder,
          skill,
        });
        res.status(201).send("Rate created");
      }
    } catch (error) {
      res.status(400).send("Bad request");
    }
  }

  async read(req: Request, res: Response): Promise<void> {
    const { wilderId, skillId } = req.params;

    const wilder = await dataSource.getRepository(WildersEntity).findOneBy({
      id: parseInt(wilderId),
    });

    if (wilder === null) {
      res.status(404).send("Wilder not found");
    }

    const skill = await dataSource.getRepository(SkillsEntity).findOneBy({
      id: parseInt(skillId),
    });

    if (skill === null) {
      res.status(404).send("Wilder not found");
    }

    try {
      if (wilder != null && skill != null) {
        const rates = await dataSource
          .getRepository(GradesEntity)
          .average("rate", { wilder, skill });
        if (rates != null) {
          res.send(Math.round(rates).toString());
        } else {
          res.send("0");
        }
      }
    } catch (error) {
      res.status(404).send(error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const rate = await dataSource.getRepository(GradesEntity).findOneBy({
        id: parseInt(req.params.id),
      });

      if (rate === null) {
        res.status(404).send("Rate not found");
      }

      await dataSource
        .getRepository(GradesEntity)
        .update(req.params.id, req.body);
      res.send("rate updated");
    } catch (error) {
      res.status(400).send("Bad request");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const rate = await dataSource.getRepository(GradesEntity).findOneBy({
        id: parseInt(req.params.id),
      });

      if (rate === null) {
        res.status(404).send("Rate not found");
      }

      await dataSource.getRepository(GradesEntity).delete(req.params.id);
      res.send("rate deleted");
    } catch (error) {
      res.status(400).send("Bad request");
    }
  }
}
