import {
  Button,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { ProjectItem } from '../../data/models/ResponseGetTranslationProject';
import { useGetProjectDetail } from '../../usecases/GetProjectDetailUseCase';
import { Locales } from 'lib/constants/locales';
import { CopyIcon } from '@chakra-ui/icons';
import { useGetProjectStatistics } from '../../usecases/GetProjectStatisticsUseCase';
import { useGetTranslatedItemsPerDay } from '../../usecases/GetTranslatedItemsPerDayUseCase';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { eachDayOfInterval, format, subDays } from 'date-fns';

type Props = {
  project: ProjectItem;
};

const ProjectDetailModal = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: projectDetail } = useGetProjectDetail(
    props.project.identifier,
    isOpen
  );

  const { data: statistics } = useGetProjectStatistics(
    props.project.identifier,
    isOpen
  );

  const { data: translatedItemsPerDay } = useGetTranslatedItemsPerDay(
    props.project.identifier,
    isOpen
  );

  const chartsData = eachDayOfInterval({
    start: subDays(new Date(), 30),
    end: new Date(),
  }).map((date) => {
    const dateString = format(date, 'yyyy-MM-dd');

    const translatedItems = translatedItemsPerDay?.find(
      (item) => item._id === dateString
    );

    return {
      name: dateString,
      total: translatedItems?.total ?? 0,
    };
  });

  return (
    <>
      <Button onClick={onOpen}>See Detail</Button>
      <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Project Detail</ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div className="space-y-2">
                <Heading size={'sm'} className="mb-4">
                  Overview
                </Heading>
                <Text>Project Name: {projectDetail?.name}</Text>
                <Text>Identifier: {projectDetail?.identifier}</Text>
                <Text>
                  <span>API Key: </span>
                  <span className="max-w-32 text-ellipsis overflow-hidden">
                    {projectDetail?.apiKey}
                  </span>
                  <IconButton
                    aria-label="Copy"
                    icon={<CopyIcon />}
                    className="ml-2"
                    size={'xs'}
                    variant={'ghost'}
                  />
                </Text>
              </div>

              <div className="space-y-2">
                <Heading size={'sm'} className="mb-4">
                  Languages
                </Heading>
                <Text>
                  Default Language:{' '}
                  {Locales.find(
                    (item) => item.code === projectDetail?.defaultLanguage
                  )?.name ?? projectDetail?.defaultLanguage}
                </Text>
                <Text>
                  Languages:{' '}
                  {projectDetail?.languages
                    .map(
                      (item) =>
                        Locales.find((locale) => locale.code === item)?.name ??
                        item
                    )
                    .join(', ')}
                </Text>
              </div>

              <div className="space-y-2">
                <Heading size={'sm'} className="mb-4">
                  Translated Items Per Day
                </Heading>

                <AreaChart
                  width={528}
                  height={250}
                  data={chartsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </div>

              <div className="space-y-2">
                <Heading size="sm" className="mb-4">
                  Statistics
                </Heading>
                {statistics
                  ?.sort((a, b) => a.namespace.localeCompare(b.namespace))
                  ?.map((item) => (
                    <div className="">
                      <Text>
                        <span>{item.namespace}</span>:{' '}
                        <span>{Math.floor(item.percentage)}%</span>
                      </Text>

                      <Progress value={item.percentage} colorScheme="green" />
                    </div>
                  ))}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectDetailModal;
