import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { ProjectItem } from '../../data/models/ResponseGetTranslationProject';
import { useGetProjectDetail } from '../../usecases/GetProjectDetailUseCase';

type Props = {
  project: ProjectItem;
};

const ProjectDetailModal = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: projectDetail } = useGetProjectDetail(
    props.project.identifier,
    isOpen
  );

  return (
    <>
      <Button onClick={onOpen}>See Detail</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Project Detail</ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <Text>Project Name: </Text>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProjectDetailModal;
