import express, {json} from "express";
import cors from "cors";
import { dataSource } from "./utils";

import { WildersController } from "./controller/WildersController";
import { SkillsController } from "./controller/SkillsController";
import { GradesController } from "./controller/GradesController";

const app = express();
app.use(json());
app.use(cors({ origin: "http://localhost:3000" }));

const wilderController = new WildersController();
const skillController = new SkillsController();
const gradeController = new GradesController();

app.post("/api/wilder", wilderController.create);
app.post(
  "/api/wilder/:wilderId/skill/:skillId/add",
  wilderController.addSkill
);
app.get("/api/wilder", wilderController.read);
app.put("/api/wilder/:id/update", wilderController.update);
app.delete("/api/wilder/:id/delete", wilderController.delete);
app.delete(
  "/api/wilder/:wilderId/skill/:skillId/delete",
  wilderController.deleteSkill
);

app.post("/api/skill", skillController.create);
app.get("/api/skill", skillController.read);
app.put("/api/skill/:id/update", skillController.update);
app.delete("/api/skill/:id/delete", skillController.delete);

app.post("/api/wilder/:wilderId/skill/:skillId/grade", gradeController.create);
app.get("/api/wilder/:wilderId/skill/:skillId/grade", gradeController.read);
app.put("/api/grade/:id/update", gradeController.update);
app.delete("/api/grade/:id/delete", gradeController.delete);

const start = async (): Promise<void> => {
  try {
    await dataSource.initialize();
    app.listen(5000, () => console.log("Server started on 5000"));
  } catch (error) {
    console.log(error)
  }
};

void start();
