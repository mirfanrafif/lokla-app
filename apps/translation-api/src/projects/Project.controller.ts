import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from 'enums/Role.enum';

import { JwtAuthGuard } from '../auth/Jwt.guard';
import { Roles } from '../auth/Role.decorator';
import { RequestCreateProject } from './Project.dto';
import { ProjectService } from './Project.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
@Roles(Role.Developer, Role.Admin)
export class ProjectController {
  constructor(private service: ProjectService) {}

  @Get()
  getAllProjects() {
    return this.service.getAllProjects();
  }

  @Post()
  createNewProject(@Body() request: RequestCreateProject) {
    return this.service.addProject(request);
  }
}
