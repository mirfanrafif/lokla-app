import React from 'react';
import { ProjectItem } from '../../data/models/ResponseGetTranslationProject';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Progress,
  Text,
} from '@chakra-ui/react';

import { Locales } from 'lib/constants/locales';
import { Link } from '@remix-run/react';
import { buildTranslationListUrl } from '../../routes/app.translations';

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
                  ) ({Math.round((stat.count / (baseLanguageCount ?? 0)) * 100)}
                  %)
                </Text>
                <Progress
                  value={(stat.count / (baseLanguageCount ?? 0)) * 100}
                />
              </div>
            ))}
        </div>
      </CardBody>
      <CardFooter className="flex flex-row gap-2">
        <Link
          to={buildTranslationListUrl({
            project: props.project.identifier,
            page: '0',
            limit: '15',
            search: undefined,
            filter: 'not_translated',
            ns: undefined,
          })}
        >
          <Button colorScheme="blue">Translate</Button>
        </Link>
        <Link to={`/app/projects/${props.project.identifier}`}>
          <Button>Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
