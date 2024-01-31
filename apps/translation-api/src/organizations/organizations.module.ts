import { Module } from "@nestjs/common";
import { OrganizationController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";
import { MongooseModule } from "@nestjs/mongoose";
import { OrganizationsModel, OrganizationsSchema } from "./organizations.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: OrganizationsModel.name,
        schema: OrganizationsSchema
      }
    ])
  ],
  controllers: [OrganizationController],
  providers: [OrganizationsService]
})
export class OrganizationsModule {}
