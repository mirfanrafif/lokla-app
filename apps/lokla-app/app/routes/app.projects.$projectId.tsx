import { CopyIcon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Heading,
  IconButton,
  Progress,
  Text,
  ModalCloseButton,
} from '@chakra-ui/react';
import { eachDayOfInterval, subDays } from 'date-fns';
import { Locales } from 'lib/constants/locales';
import { format } from 'date-fns';
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from 'recharts';

import { ProjectItem } from '../data/models/ResponseGetTranslationProject';
import { LoaderFunctionArgs } from '@remix-run/node';
import {
  getProjectDetail,
  getProjectStatistics,
  getTranslatedItemsPerDay,
} from '../data/services/TranslationService';
import { authenticator } from '../utils/auth';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { ResponseGetProjectDetail } from '../data/models/ResponseGetProjectDetail';
import { ResponseGetStatistics } from '../data/models/ResponseGetStatistics';
import { ResponseGetTranslatedItemsPerDay } from '../data/models/ResponseGetTranslatedItemsPerDay';
type Props = {
  project: ProjectItem;
};

type LoaderData = {
  projectDetail: ResponseGetProjectDetail;
  statistics: ResponseGetStatistics;
  translatedItemsPerDay: ResponseGetTranslatedItemsPerDay;
};

const ProjectDetailModal = () => {
  const { projectDetail, statistics, translatedItemsPerDay } =
    useLoaderData<LoaderData>();

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

  const navigate = useNavigate();

  return (
    <>
      <Modal
        isOpen={true}
        onClose={() => {
          navigate(-1);
        }}
        size={'xl'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
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
                  width={window.innerWidth > 768 ? 528 : 250}
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

export async function loader({ request, params }: LoaderFunctionArgs) {
  const authData = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const projectId = params.projectId;

  if (!projectId) {
    return {
      project: null,
    };
  }

  const projectDetail = await getProjectDetail(projectId, authData.accessToken);

  const statistics = await getProjectStatistics(
    projectId,
    authData.accessToken
  );

  const translatedItemsPerDay = await getTranslatedItemsPerDay(
    projectId,
    authData.accessToken
  );

  return {
    project: projectDetail,
    statistics: statistics,
    translatedItemsPerDay: translatedItemsPerDay,
  };
}

export default ProjectDetailModal;
