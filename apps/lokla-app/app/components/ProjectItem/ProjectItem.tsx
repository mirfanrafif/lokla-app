import React from 'react';
import { ProjectItem } from '../../data/models/ResponseGetTranslationProject';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  List,
  ListItem,
  Progress,
  Text,
} from '@chakra-ui/react';

import { Locales } from 'lib/constants/locales';

const ProjectCard = (props: { project: ProjectItem }) => {
  const baseLanguageCount = props.project.statistics?.find(
    (stat) => stat.locale === props.project.defaultLanguage
  )?.count;

  return (
    <Card>
      <CardHeader>
        <Heading size={'lg'}>{props.project.name}</Heading>
      </CardHeader>
      <CardBody className="flex flex-row gap-x-4">
        <div className="flex-1">
          <Text>
            Base Language:{' '}
            <b>
              {
                Locales.find(
                  (item) => item.code === props.project.defaultLanguage
                )?.name
              }{' '}
              ({props.project.defaultLanguage})
            </b>
          </Text>

          <Text>Keys: {baseLanguageCount}</Text>
        </div>

        <div className="flex-1">
          <Text>Target Languages: </Text>

          {props.project.statistics
            ?.filter((item) => item.locale !== props.project.defaultLanguage)
            ?.map((stat) => (
              <div className="space-y-1">
                <Text>
                  {Locales.find((item) => item.code === stat.locale)?.name ??
                    stat.locale}{' '}
                  ({Math.round((stat.count / (baseLanguageCount ?? 0)) * 100)}%)
                </Text>
                <Progress
                  value={(stat.count / (baseLanguageCount ?? 0)) * 100}
                />
              </div>
            ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default ProjectCard;
