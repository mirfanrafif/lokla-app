import React from 'react';
import { ProjectItem } from '../../data/models/ResponseGetTranslationProject';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Progress,
  Text,
} from '@chakra-ui/react';

import { Locales } from 'lib/constants/locales';
import { Link } from '@remix-run/react';

const ProjectCard = (props: { project: ProjectItem }) => {
  const baseLanguageCount = props.project.statistics?.find(
    (stat) => stat.locale === props.project.defaultLanguage
  )?.count;

  return (
    <Link
      to={`/translations?project=${props.project.identifier}`}
      className="block"
    >
      <Card>
        <CardHeader>
          <Heading size={'lg'}>{props.project.name}</Heading>
        </CardHeader>
        <CardBody className="flex flex-row gap-x-4">
          <div className="flex-1">
            <Text>
              Base Language:{' '}
              <b>
                {props.project.defaultLanguage} (
                {
                  Locales.find(
                    (item) => item.code === props.project.defaultLanguage
                  )?.name
                }
                )
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
                    {stat.locale} (
                    {Locales.find((item) => item.code === stat.locale)?.name ??
                      'custom language'}
                    ) (
                    {Math.round((stat.count / (baseLanguageCount ?? 0)) * 100)}
                    %)
                  </Text>
                  <Progress
                    value={(stat.count / (baseLanguageCount ?? 0)) * 100}
                  />
                </div>
              ))}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};

export default ProjectCard;
